import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { Link } from 'react-router-dom';
import type { SceneDetailsDto, SceneObjectDto } from '../../types/scenes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ConeIcon,
  CubeIcon,
  CylinderIcon,
  MarkIcon,
  PlaneIcon,
  PyramidIcon,
  SphereIcon,
} from '../../components/icons/SceneIcons';

interface SceneSidebarProps {
  scene: SceneDetailsDto | null;
  elements: SceneObjectDto[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSceneNameCommit: (nextName: string) => void | Promise<void>;
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

function ObjectIcon({ type }: { type: SceneObjectDto['type'] }) {
  if (type === 'Sphere') {
    return <SphereIcon />;
  }

  if (type === 'Cylinder') {
    return <CylinderIcon />;
  }

  if (type === 'Cone') {
    return <ConeIcon />;
  }

  if (type === 'Pyramid') {
    return <PyramidIcon />;
  }

  if (type === 'Plane') {
    return <PlaneIcon />;
  }

  return <CubeIcon />;
}

function HeaderButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
    >
      {children}
    </button>
  );
}

function SceneSidebar({
  scene,
  elements,
  collapsed,
  onToggleCollapse,
  onSceneNameCommit,
  activeObjectId,
  setActiveObjectId,
}: SceneSidebarProps) {
  const [draftSceneName, setDraftSceneName] = useState(scene?.name ?? '');

  useEffect(() => {
    setDraftSceneName(scene?.name ?? '');
  }, [scene?.name]);

  const commitSceneName = () => {
    const trimmedName = draftSceneName.trim();

    if (!scene || trimmedName === '' || trimmedName === scene.name) {
      setDraftSceneName(scene?.name ?? '');
      return;
    }

    void onSceneNameCommit(trimmedName);
  };

  if (collapsed) {
    return (
      <div className="flex h-full flex-col items-center gap-1.5 rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-1.5 py-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
        <Link
          to="/"
          aria-label="Back to dashboard"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
        >
          <MarkIcon />
        </Link>
        <HeaderButton label="Expand sidebar" onClick={onToggleCollapse}>
          <ChevronRightIcon />
        </HeaderButton>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] shadow-[var(--shadow-panel)] backdrop-blur-xl">
      <div className="border-b border-[color:var(--border-subtle)] px-2 py-2">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            aria-label="Back to dashboard"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
          >
            <MarkIcon />
          </Link>
          <input
            type="text"
            value={draftSceneName}
            onChange={(event) => setDraftSceneName(event.target.value)}
            onBlur={commitSceneName}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                commitSceneName();
                event.currentTarget.blur();
              }

              if (event.key === 'Escape') {
                setDraftSceneName(scene?.name ?? '');
                event.currentTarget.blur();
              }
            }}
            placeholder="Untitled scene"
            className="min-w-0 flex-1 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 text-[0.86rem] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] outline-none placeholder:text-[color:var(--text-muted)]"
          />
          <HeaderButton label="Collapse sidebar" onClick={onToggleCollapse}>
            <ChevronLeftIcon />
          </HeaderButton>
        </div>
      </div>

      <div className="border-b border-[color:var(--border-subtle)] px-2 pt-1.5">
        <div className="flex items-end gap-1 text-xs">
          <button
            type="button"
            className="rounded-t-[10px] border border-b-0 border-[color:var(--border-strong)] bg-[var(--surface-elevated)] px-3 py-1.5 font-semibold leading-none text-[color:var(--text-primary)] shadow-[0_-1px_0_rgba(255,255,255,0.03)]"
          >
            Scene
          </button>
          <button
            type="button"
            className="rounded-t-[10px] border border-b-0 border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 font-medium leading-none text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            Assets
          </button>
          <button
            type="button"
            className="rounded-t-[10px] border border-b-0 border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-1.5 font-medium leading-none text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
          >
            Tools
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-1.5 py-2">
        <p className="px-1 pb-1.5 text-[0.64rem] font-medium uppercase tracking-[0.16em] text-[color:var(--text-muted)]">
          Elements
        </p>

        <div className="space-y-0.5">
          {elements.map((element) => {
            const isActive = element.id === activeObjectId

            return (
              <button
                key={element.id}
                type="button"
                onClick={() => {
                  setActiveObjectId(element.id);
                  console.log(activeObjectId)
                }}
                className={`flex w-full items-center gap-1.5 rounded-[8px] px-1.5 py-1.5 text-left transition hover:cursor-pointer ${
                  isActive
                    ? 'bg-[rgba(251,146,60,0.14)] text-[color:var(--text-primary)]'
                    : 'text-[color:var(--text-secondary)] hover:bg-[var(--surface-muted)]'
                }`}
              >
                <div className="text-[color:var(--text-muted)]">
                  <ObjectIcon type={element.type} />
                </div>
                <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium">
                  {element.name}
                </span>
                {isActive ? (
                  <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--text-secondary)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SceneSidebar;
