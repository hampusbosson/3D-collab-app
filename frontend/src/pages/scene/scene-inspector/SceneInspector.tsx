import type { Dispatch, SetStateAction } from 'react';
import type { SceneObjectDto } from '../../../types/scenes';
import MaterialSection from './MaterialSection';
import TransformSection from './TransformSection';

interface SceneInspectorProps {
  activeObject: SceneObjectDto | null;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

function deleteObject(
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>,
  setActiveObjectId: Dispatch<SetStateAction<string | null>>,
  activeObjectId: string,
) {
  setSceneObjects((objects) =>
    objects.filter((object) => object.id !== activeObjectId),
  );
  setActiveObjectId(null);
}

function SceneInspector({
  activeObject,
  setSceneObjects,
  setActiveObjectId,
}: SceneInspectorProps) {
  if (!activeObject) {
    return (
      <div className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl">
        <p className="text-[0.84rem] font-medium text-[color:var(--text-primary)]">
          No object selected
        </p>
        <p className="mt-2 text-[0.74rem] leading-5 text-[color:var(--text-secondary)]">
          Select an object to edit its transform and material values.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] p-3 shadow-[var(--shadow-panel)] backdrop-blur-xl">
      <div className="border-b border-[color:var(--border-subtle)] pb-3">
        <p className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
          Selected Object
        </p>
        <h1 className="mt-1 text-[0.96rem] font-semibold text-[color:var(--text-primary)]">
          {activeObject.name}
        </h1>
      </div>

      <TransformSection
        activeObject={activeObject}
        setSceneObjects={setSceneObjects}
      />

      <MaterialSection
        activeObject={activeObject}
        setSceneObjects={setSceneObjects}
      />

      <button
        type="button"
        onClick={() =>
          deleteObject(setSceneObjects, setActiveObjectId, activeObject.id)
        }
        className="w-full rounded-[18px] border border-[rgba(209,61,79,0.32)] bg-[rgba(209,61,79,0.1)] px-3 py-2.5 text-sm font-medium text-[color:var(--danger-solid,#d13d4f)] transition hover:cursor-pointer hover:bg-[rgba(209,61,79,0.16)]"
      >
        Delete object
      </button>
    </div>
  );
}

export default SceneInspector;
