interface SceneOnboardingModalProps {
  isOpen: boolean;
  dontShowAgain: boolean;
  onClose: () => void;
  onDontShowAgainChange: (checked: boolean) => void;
}

function SceneOnboardingModal({
  isOpen,
  dontShowAgain,
  onClose,
  onDontShowAgainChange,
}: SceneOnboardingModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.68)] px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-panel)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-secondary)]">
            Scene Guide
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
            Quick start
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
            Use the scene like a lightweight 3D editor. Add shapes, select them,
            transform them, and adjust material settings from the right panel.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3">
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
              Create objects
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Use the shape bar at the bottom to add cubes, spheres, cylinders,
              cones, pyramids, and planes.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3">
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
              Transform objects
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Click an object to select it. Drag the gizmo to transform it.
              <span className="font-medium text-[color:var(--text-primary)]">
                {" "}
                Right click the selected object
              </span>{" "}
              to cycle between location, rotation, and scale modes.
            </p>
            <p className="mt-2 rounded-xl border border-[rgba(251,146,60,0.24)] bg-[rgba(251,146,60,0.1)] px-3 py-2 text-[0.8rem] text-[color:var(--text-primary)]">
              Example: select a sphere, right click once for rotation, then drag
              the gizmo ring. Right click again to switch to scale.
            </p>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3">
            <p className="text-sm font-semibold text-[color:var(--text-primary)]">
              Delete objects
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">
              Select an object, then use the delete action in the right sidebar
              inspector to remove it from the scene.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => onDontShowAgainChange(event.target.checked)}
              className="h-4 w-4 rounded border border-[color:var(--border-strong)] accent-[var(--accent-primary)]"
            />
            Don't show this again
          </label>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-[var(--accent-primary)] px-4 py-2.5 text-sm font-medium text-[color:var(--accent-contrast)] transition hover:opacity-90"
          >
            Start editing
          </button>
        </div>
      </div>
    </div>
  );
}

export default SceneOnboardingModal;
