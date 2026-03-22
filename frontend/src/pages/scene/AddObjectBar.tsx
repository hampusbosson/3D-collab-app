import type { HubConnection } from "@microsoft/signalr";
import { primitiveIcons } from "../../components/icons/SceneIcons";
import type { MutableRefObject } from "react";
import type { PrimitiveType } from "../../types/scene";
import type { CreateSceneObjectDto, SceneObjectDto } from "../../types/scenes";

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
  connectionRef: MutableRefObject<HubConnection | null>;
  sceneObjects: SceneObjectDto[];
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
  connectionRef,
  sceneObjects,
}: AddObjectBarProps) {
  const handleButtonClick = async (primitive: ToolbarPrimitive) => {
    try {
      const payload = createSceneObjectPayload(
        primitive.sceneType,
        sceneObjects.length,
      );

      await connectionRef.current?.invoke("AddObject", sceneId, payload); 
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
