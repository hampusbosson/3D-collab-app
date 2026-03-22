import { Link } from 'react-router-dom';
import { ArrowIcon, DeleteIcon } from '../../components/icons/DashboardIcons';
import type { SceneDto } from '../../types/scenes';

interface SceneCardProps {
  scene: SceneDto;
  onDeleteClick: (scene: SceneDto) => void;
}

function formatSceneUpdatedAt(updatedAt: string) {
  const parsedDate = new Date(updatedAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return updatedAt;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsedDate);
}

function SceneCard({ scene, onDeleteClick }: SceneCardProps) {
  return (
    <div className="group relative rounded-[32px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)]">
      <button
        type="button"
        aria-label={`Delete ${scene.name}`}
        onClick={() => onDeleteClick(scene)}
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] text-[color:var(--text-secondary)] opacity-0 shadow-[var(--shadow-soft)] transition hover:cursor-pointer hover:border-[color:var(--danger-solid,#d13d4f)] hover:bg-[rgba(209,61,79,0.12)] hover:text-[color:var(--danger-solid,#d13d4f)] group-hover:opacity-100"
      >
        <DeleteIcon />
      </button>

      <Link to={`/scene/${scene.id}`} className="block">
        <div className="mt-5 flex items-start gap-4 pr-14">
          <div>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
              {scene.name}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
              Updated {formatSceneUpdatedAt(scene.updatedAt)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[color:var(--border-subtle)] pt-4">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--surface-elevated)] bg-[var(--surface-soft)] text-[11px] font-medium text-[color:var(--text-secondary)]"
              >
                {String.fromCharCode(65 + index)}
              </div>
            ))}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[color:var(--text-secondary)] transition group-hover:border-[color:var(--border-strong)] group-hover:bg-[var(--surface-strong)] group-hover:text-[color:var(--text-inverse)]">
            <ArrowIcon />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SceneCard;
