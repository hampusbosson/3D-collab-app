import type { SceneDto } from '../../types/scenes';

interface DeleteSceneModalProps {
  scene: SceneDto | null;
  isOpen: boolean;
  errorMessage?: string | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: (sceneId: string) => void;
}

function DeleteSceneModal({
  scene,
  isOpen,
  errorMessage,
  isDeleting = false,
  onClose,
  onConfirm,
}: DeleteSceneModalProps) {
  if (!isOpen || !scene) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(2,6,23,0.6)] px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-6 shadow-[var(--shadow-panel)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
            Delete Scene
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
            Are you sure you want to delete this scene?
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
            This will remove <span className="font-medium text-[color:var(--text-primary)]">{scene.name}</span> from
            your current dashboard view.
          </p>
          {errorMessage ? (
            <div className="mt-4 rounded-2xl border border-[rgba(209,61,79,0.32)] bg-[rgba(209,61,79,0.1)] px-4 py-3 text-sm text-[color:var(--danger-solid,#d13d4f)]">
              {errorMessage}
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:cursor-pointer hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(scene.id)}
            disabled={isDeleting}
            className="rounded-2xl bg-[var(--danger-solid,#d13d4f)] px-4 py-2.5 text-sm font-medium text-white transition hover:cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Deleting...' : 'Delete scene'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteSceneModal;
