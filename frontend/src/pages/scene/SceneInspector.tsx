import { useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { SceneObject, VectorField } from '../../types/scene';

interface SceneInspectorProps {
  activeObject: SceneObject | null;
  setSceneObjects: Dispatch<SetStateAction<SceneObject[]>>;
}

// Shared wrapper for inspector sections like Transform and Material.
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-soft)]">
      <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-secondary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

// Numeric field that keeps a temporary string value while the user is editing.
function NumberField({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  const [draftValue, setDraftValue] = useState(String(value));

  useEffect(() => {
    setDraftValue(String(value));
  }, [value]);

  const commitValue = () => {
    if (draftValue.trim() === '') {
      setDraftValue(String(value));
      return;
    }

    const parsedValue = Number(draftValue);

    if (Number.isFinite(parsedValue)) {
      onChange(parsedValue);
      setDraftValue(String(parsedValue));
      return;
    }

    setDraftValue(String(value));
  };

  return (
    <label className="space-y-1">
      <span className="text-[0.64rem] font-medium uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={draftValue}
        onChange={(event) => setDraftValue(event.target.value)}
        onBlur={commitValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commitValue();
            event.currentTarget.blur();
          }

          if (event.key === 'Escape') {
            setDraftValue(String(value));
            event.currentTarget.blur();
          }
        }}
        className="w-full rounded-lg border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-2 py-1.5 text-[0.76rem] text-[color:var(--text-primary)]"
      />
    </label>
  );
}

// Updates one axis inside a vector property on the active scene object.
function updateVector(
  setSceneObjects: Dispatch<SetStateAction<SceneObject[]>>,
  activeObjectId: string,
  field: VectorField,
  axisIndex: number,
  nextValue: number,
) {
  setSceneObjects((objects) =>
    objects.map((object) => {
      if (object.id !== activeObjectId) {
        return object;
      }

      const nextVector = [...object[field]] as [number, number, number];
      nextVector[axisIndex] = Number.isFinite(nextValue) ? nextValue : 0;

      return {
        ...object,
        [field]: nextVector,
      };
    }),
  );
}

// Updates a single material-related property on the active scene object.
function updateMaterialField(
  setSceneObjects: Dispatch<SetStateAction<SceneObject[]>>,
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

// Renders one labeled XYZ row inside the transform inspector, call 'updateVector' on change
function VectorRow({
  label,
  values,
  onChange,
}: {
  label: string;
  values: [number, number, number];
  onChange: (axisIndex: number, value: number) => void;
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0 space-y-1.5">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[color:var(--text-secondary)]">
        {label}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {(['X', 'Y', 'Z'] as const).map((axis, index) => (
          <NumberField
            key={`${label}-${axis}`}
            label={axis}
            value={values[index]}
            onChange={(value) => onChange(index, value)}
          />
        ))}
      </div>
    </div>
  );
}

// Inspector panel for editing the currently selected scene object.
function SceneInspector({ activeObject, setSceneObjects }: SceneInspectorProps) {
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

      <Section title="Transform">
        <div className="divide-y divide-[color:var(--border-subtle)]">
          <VectorRow
            label="Location"
            values={activeObject.position}
            onChange={(index, value) =>
              updateVector(setSceneObjects, activeObject.id, 'position', index, value)
            }
          />
          <VectorRow
            label="Rotation"
            values={activeObject.rotation}
            onChange={(index, value) =>
              updateVector(setSceneObjects, activeObject.id, 'rotation', index, value)
            }
          />
          <VectorRow
            label="Scale"
            values={activeObject.scale}
            onChange={(index, value) =>
              updateVector(setSceneObjects, activeObject.id, 'scale', index, value)
            }
          />
        </div>
      </Section>

      <Section title="Material">
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
      </Section>
    </div>
  );
}

export default SceneInspector;
