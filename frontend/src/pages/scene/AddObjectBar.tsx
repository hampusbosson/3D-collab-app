import { primitiveIcons } from "../../components/icons/SceneIcons";
import type { PrimitiveType } from "../../types/scene";

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
  onAddObject: (type: PrimitiveType) => void;
}

function AddObjectBar({ onAddObject }: AddObjectBarProps) {
  const handleButtonClick = (primitive: ToolbarPrimitive) => {
    onAddObject(primitive.sceneType);
  };

  return (
    <div className="pointer-events-auto flex w-full items-center justify-center rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-2 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl lg:inline-flex lg:w-auto lg:px-3">
      <div className="flex flex-wrap items-center justify-center gap-1">
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
    </div>
  );
}

export default AddObjectBar;
