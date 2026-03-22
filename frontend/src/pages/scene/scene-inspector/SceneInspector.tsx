import type { HubConnection } from "@microsoft/signalr";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { SceneObjectDto } from "../../../types/scenes";
import MaterialSection from "./MaterialSection";
import TransformSection from "./TransformSection";

interface SceneInspectorProps {
  sceneId: string;
  connectionRef: MutableRefObject<HubConnection | null>;
  activeObject: SceneObjectDto | null;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

function SceneInspector({
  sceneId,
  connectionRef,
  activeObject,
  setSceneObjects,
}: SceneInspectorProps) {

  if (!activeObject) {
    return (
      <div className="rounded-[18px] border border-(--border-subtle) bg-(--surface-sidebar) p-4 shadow-(--shadow-panel) backdrop-blur-xl">
        <p className="text-[0.84rem] font-medium text-(--text-primary)">
          No object selected
        </p>
        <p className="mt-2 text-[0.74rem] leading-5 text-(--text-secondary)">
          Select an object to edit its transform and material values.
        </p>
      </div>
    );
  }


  const deleteObject = async () => {
    try {
      await connectionRef.current?.invoke("DeleteObject", sceneId, activeObject.id);
    } catch (error) {
      console.error("failed to delete object", error);
    }
  };

  return (
    <div className="space-y-3 rounded-[18px] border border-(--border-subtle) bg-(--surface-sidebar) p-3 shadow-(--shadow-panel) backdrop-blur-xl">
      <div className="border-b border-(--border-subtle) pb-3">
        <p className="text-[0.64rem] font-medium uppercase tracking-[0.14em] text-(--text-muted)">
          Selected Object
        </p>
        <h1 className="mt-1 text-[0.96rem] font-semibold text-(--text-primary)">
          {activeObject.name}
        </h1>
      </div>

      <TransformSection
        activeObject={activeObject}
        setSceneObjects={setSceneObjects}
      />

      <MaterialSection
        sceneId={sceneId}
        connectionRef={connectionRef}
        activeObject={activeObject}
        setSceneObjects={setSceneObjects}
      />

      <button
        type="button"
        onClick={deleteObject}
        className="w-full rounded-[18px] border border-[rgba(209,61,79,0.32)] bg-[rgba(209,61,79,0.1)] px-3 py-2.5 text-sm font-medium text-(--danger-solid,#d13d4f) transition hover:cursor-pointer hover:bg-[rgba(209,61,79,0.16)]"
      >
        Delete object
      </button>
    </div>
  );
}

export default SceneInspector;
