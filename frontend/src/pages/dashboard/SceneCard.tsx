import { Link } from 'react-router-dom';
import { ArrowIcon, DeleteIcon } from '../../components/icons/DashboardIcons';
import type { SceneDto } from '../../types/scenes';
import PreviewThumbnail from './PreviewThumbnail';

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
    <div className="group relative min-w-0 w-full max-w-full overflow-hidden rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)] sm:rounded-[32px] sm:p-4">
      <Link to={`/scene/${scene.id}`} className="block min-w-0 w-full">
        <PreviewThumbnail objects={scene.previewObjects} />
        <div className="mt-4 flex items-start justify-between gap-3 sm:mt-5 sm:gap-4">
          <div className="min-w-0">
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)] sm:mt-3 sm:text-2xl">
              {scene.name}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
              Updated {formatSceneUpdatedAt(scene.updatedAt)}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Delete ${scene.name}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDeleteClick(scene);
            }}
            className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] text-[color:var(--text-secondary)] opacity-0 shadow-[var(--shadow-soft)] transition hover:cursor-pointer hover:border-[color:var(--danger-solid,#d13d4f)] hover:bg-[rgba(209,61,79,0.12)] hover:text-[color:var(--danger-solid,#d13d4f)] group-hover:opacity-100 sm:mt-2 sm:h-10 sm:w-10"
          >
            <DeleteIcon />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[color:var(--border-subtle)] pt-3 sm:mt-5 sm:pt-4">
          <div className="flex -space-x-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--surface-elevated)] bg-[var(--surface-soft)] text-[10px] font-medium text-[color:var(--text-secondary)] sm:h-9 sm:w-9 sm:text-[11px]"
              >
                {String.fromCharCode(65 + index)}
              </div>
            ))}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[color:var(--text-secondary)] transition group-hover:border-[color:var(--accent-primary)] group-hover:bg-[color:var(--accent-primary)] group-hover:text-[color:var(--accent-contrast)] sm:h-10 sm:w-10">
            <ArrowIcon />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SceneCard;
