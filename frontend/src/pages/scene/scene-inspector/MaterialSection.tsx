import type { Dispatch, SetStateAction } from 'react';
import type { SceneObjectDto } from '../../../types/scenes';
import InspectorSection from './InspectorSection';

interface MaterialSectionProps {
  activeObject: SceneObjectDto;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

function updateMaterialField(
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>,
  activeObjectId: string,
  field: 'color' | 'opacity',
  nextValue: string | number,
) {
  setSceneObjects((objects) =>
    objects.map((object) =>
      object.id === activeObjectId
        ? {
            ...object,
            [field]: nextValue,
          }
        : object,
    ),
  );
}

function MaterialSection({
  activeObject,
  setSceneObjects,
}: MaterialSectionProps) {
  return (
    <InspectorSection title="Material">
      <div className="space-y-3">
        <label className="block space-y-1">
          <span className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
            Color
          </span>
          <div className="flex items-center gap-2 rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-2 py-2">
            <input
              type="color"
              value={activeObject.color}
              onChange={(event) =>
                updateMaterialField(setSceneObjects, activeObject.id, 'color', event.target.value)
              }
              className="h-7 w-9 rounded border-none bg-transparent p-0"
            />
            <span className="text-[0.76rem] text-[color:var(--text-primary)]">
              {activeObject.color}
            </span>
          </div>
        </label>

        <label className="block space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
              Opacity
            </span>
            <span className="text-[0.74rem] text-[color:var(--text-secondary)]">
              {activeObject.opacity.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={activeObject.opacity}
            onChange={(event) =>
              updateMaterialField(
                setSceneObjects,
                activeObject.id,
                'opacity',
                Number(event.target.value),
              )
            }
            className="w-full accent-[var(--text-primary)]"
          />
        </label>
      </div>
    </InspectorSection>
  );
}

export default MaterialSection;
