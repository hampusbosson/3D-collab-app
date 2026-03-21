import { primitiveIcons } from "../../components/icons/SceneIcons";
import type { Dispatch, SetStateAction } from "react";
import type { PrimitiveType } from "../../types/scene";
import type { CreateSceneObjectDto, SceneObjectDto } from "../../types/scenes";
import { addObjectToScene } from "../../api/sceneObjects";

type ToolbarPrimitive = {
  id: "cube" | "sphere" | "cylinder" | "cone" | "pyramid" | "plane";
  label: string;
  sceneType: PrimitiveType;
};

const primitiveButtons: ToolbarPrimitive[] = [
  { id: "cube", label: "Add cube", sceneType: "Cube" },
  { id: "sphere", label: "Add sphere", sceneType: "Sphere" },
  { id: "cylinder", label: "Add cylinder", sceneType: "Cylinder" },
  { id: "cone", label: "Add cone", sceneType: "Cone" },
  { id: "pyramid", label: "Add pyramid", sceneType: "Pyramid" },
  { id: "plane", label: "Add plane", sceneType: "Plane" },
] as const;

interface AddObjectBarProps {
  sceneId: string;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
  sceneObjects: SceneObjectDto[];
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

function createSceneObjectPayload(
  type: PrimitiveType,
  index: number,
): CreateSceneObjectDto {
  return {
    type,
    name: `${type} ${index + 1}`,
    positionX: 0,
    positionY: 0.7,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    color: "#fb923c",
    opacity: 1,
  };
}

function AddObjectBar({
  sceneId,
  setSceneObjects,
  sceneObjects,
  setActiveObjectId,
}: AddObjectBarProps) {
  const handleButtonClick = async (primitive: ToolbarPrimitive) => {
    try {
      const payload = createSceneObjectPayload(
        primitive.sceneType,
        sceneObjects.length,
      );

      const createdObject = await addObjectToScene(sceneId, payload);

      setSceneObjects((currentObjects) => [...currentObjects, createdObject]);
      setActiveObjectId(createdObject.id);
    } catch (error) {
      console.error("Failed to add object to scene", error);
    }
  };

  return (
    <div className="pointer-events-auto inline-flex items-center gap-1 rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      {primitiveButtons.map((primitive) => (
        <button
          key={primitive.id}
          type="button"
          aria-label={primitive.label}
          onClick={() => handleButtonClick(primitive)}
          className="flex h-8.5 w-8.5 items-center justify-center rounded-lg transition hover:bg-[var(--surface-elevated)]"
        >
          {primitiveIcons[primitive.id]}
        </button>
      ))}
    </div>
  );
}

export default AddObjectBar;
