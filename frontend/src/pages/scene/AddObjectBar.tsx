import {
  ConeIcon,
  CubeIcon,
  CylinderIcon,
  PlaneIcon,
  PyramidIcon,
  SphereIcon,
} from "../../components/icons/SceneIcons";
import type { Dispatch, SetStateAction } from "react";
import type { PrimitiveType } from "../../types/scene";
import type { SceneObjectDto } from "../../types/scenes";

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

const primitiveIcons = {
  cube: (
    <CubeIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  sphere: (
    <SphereIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  cylinder: (
    <CylinderIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  cone: (
    <ConeIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  pyramid: (
    <PyramidIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  plane: (
    <PlaneIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
} as const;

interface AddObjectBarProps {
  sceneId: string;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

function createSceneObject(
  type: PrimitiveType,
  index: number,
  id: string,
  sceneId: string,
): SceneObjectDto {
  return {
    id,
    sceneId,
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
    createdBy: "Guest",
    updatedAt: new Date().toISOString(),
  };
}

function AddObjectBar({
  sceneId,
  setSceneObjects,
  setActiveObjectId,
}: AddObjectBarProps) {
  const handleButtonClick = (primitive: ToolbarPrimitive) => {
    const objectId = `${primitive.sceneType.toLowerCase()}-${crypto.randomUUID()}`;

    setSceneObjects((currentObjects) => [
      ...currentObjects,
      createSceneObject(primitive.sceneType, currentObjects.length, objectId, sceneId),
    ]);

    setActiveObjectId(objectId);
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
