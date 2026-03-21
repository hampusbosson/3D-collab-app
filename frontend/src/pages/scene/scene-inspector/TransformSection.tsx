import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import type { VectorField } from '../../../types/scene';
import type { SceneObjectDto } from '../../../types/scenes';
import InspectorSection from './InspectorSection';

interface TransformSectionProps {
  activeObject: SceneObjectDto;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

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

function updateVector(
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>,
  activeObjectId: string,
  field: VectorField,
  axisIndex: number,
  nextValue: number,
) {
  const numericValue = Number.isFinite(nextValue) ? nextValue : 0;

  setSceneObjects((objects) =>
    objects.map((object) => {
      if (object.id !== activeObjectId) {
        return object;
      }

      if (field === 'position') {
        const nextPositionFields = ['positionX', 'positionY', 'positionZ'] as const;
        return {
          ...object,
          [nextPositionFields[axisIndex]]: numericValue,
        };
      }

      if (field === 'rotation') {
        const nextRotationFields = ['rotationX', 'rotationY', 'rotationZ'] as const;
        return {
          ...object,
          [nextRotationFields[axisIndex]]: numericValue,
        };
      }

      const nextScaleFields = ['scaleX', 'scaleY', 'scaleZ'] as const;
      return {
        ...object,
        [nextScaleFields[axisIndex]]: numericValue,
      };
    }),
  );
}

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
    <div className="space-y-1.5 py-4 first:pt-0 last:pb-0">
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

function TransformSection({
  activeObject,
  setSceneObjects,
}: TransformSectionProps) {
  return (
    <InspectorSection title="Transform">
      <div className="divide-y divide-[color:var(--border-subtle)]">
        <VectorRow
          label="Location"
          values={[activeObject.positionX, activeObject.positionY, activeObject.positionZ]}
          onChange={(index, value) =>
            updateVector(setSceneObjects, activeObject.id, 'position', index, value)
          }
        />
        <VectorRow
          label="Rotation"
          values={[activeObject.rotationX, activeObject.rotationY, activeObject.rotationZ]}
          onChange={(index, value) =>
            updateVector(setSceneObjects, activeObject.id, 'rotation', index, value)
          }
        />
        <VectorRow
          label="Scale"
          values={[activeObject.scaleX, activeObject.scaleY, activeObject.scaleZ]}
          onChange={(index, value) =>
            updateVector(setSceneObjects, activeObject.id, 'scale', index, value)
          }
        />
      </div>
    </InspectorSection>
  );
}

export default TransformSection;
