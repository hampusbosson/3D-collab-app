import { useEffect, useState } from 'react';
import type { SceneObjectDto } from '../../../types/scenes';
import InspectorSection from './InspectorSection';

interface TransformSectionProps {
  activeObject: SceneObjectDto;
  onCommitObject: (nextObject: SceneObjectDto) => void;
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
  activeObject: SceneObjectDto,
  onCommitObject: (nextObject: SceneObjectDto) => void,
  field: 'position' | 'rotation' | 'scale',
  axisIndex: number,
  nextValue: number,
) {
  const numericValue = Number.isFinite(nextValue) ? nextValue : 0;

  if (field === 'position') {
    const nextPositionFields = ['positionX', 'positionY', 'positionZ'] as const;
    onCommitObject({
      ...activeObject,
      [nextPositionFields[axisIndex]]: numericValue,
    });
    return;
  }

  if (field === 'rotation') {
    const nextRotationFields = ['rotationX', 'rotationY', 'rotationZ'] as const;
    onCommitObject({
      ...activeObject,
      [nextRotationFields[axisIndex]]: numericValue,
    });
    return;
  }

  const nextScaleFields = ['scaleX', 'scaleY', 'scaleZ'] as const;
  onCommitObject({
    ...activeObject,
    [nextScaleFields[axisIndex]]: numericValue,
  });
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
  onCommitObject,
}: TransformSectionProps) {
  return (
    <InspectorSection title="Transform">
      <div className="divide-y divide-[color:var(--border-subtle)]">
        <VectorRow
          label="Location"
          values={[activeObject.positionX, activeObject.positionY, activeObject.positionZ]}
          onChange={(index, value) =>
            updateVector(activeObject, onCommitObject, 'position', index, value)
          }
        />
        <VectorRow
          label="Rotation"
          values={[activeObject.rotationX, activeObject.rotationY, activeObject.rotationZ]}
          onChange={(index, value) =>
            updateVector(activeObject, onCommitObject, 'rotation', index, value)
          }
        />
        <VectorRow
          label="Scale"
          values={[activeObject.scaleX, activeObject.scaleY, activeObject.scaleZ]}
          onChange={(index, value) =>
            updateVector(activeObject, onCommitObject, 'scale', index, value)
          }
        />
      </div>
    </InspectorSection>
  );
}

export default TransformSection;
