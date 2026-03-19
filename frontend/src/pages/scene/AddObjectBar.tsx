import {
  ConeIcon,
  CubeIcon,
  CylinderIcon,
  PlaneIcon,
  PyramidIcon,
  SphereIcon,
} from '../../components/icons/SceneIcons';

const primitiveButtons = [
  { id: 'cube', label: 'Add cube' },
  { id: 'sphere', label: 'Add sphere' },
  { id: 'cylinder', label: 'Add cylinder' },
  { id: 'cone', label: 'Add cone' },
  { id: 'pyramid', label: 'Add pyramid' },
  { id: 'plane', label: 'Add plane' },
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

function AddObjectBar() {
  return (
    <div className="pointer-events-auto inline-flex items-center gap-1 rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      {primitiveButtons.map((primitive) => (
        <button
          key={primitive.id}
          type="button"
          aria-label={primitive.label}
          className="flex h-8.5 w-8.5 items-center justify-center rounded-lg transition hover:bg-[var(--surface-elevated)]"
        >
          {primitiveIcons[primitive.id]}
        </button>
      ))}
    </div>
  );
}

export default AddObjectBar;
