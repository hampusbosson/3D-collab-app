import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SceneSummary } from '../../types/scenes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  CylinderIcon,
  EyeIcon,
  LockIcon,
  MarkIcon,
  SphereIcon,
} from '../../components/icons/SceneIcons';
import type { SceneObject } from './types';
import React from 'react';

interface SceneSidebarProps {
  scene: SceneSummary;
  elements: SceneObject[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeObjectId: string | null;
  setActiveObjectId: React.Dispatch<React.SetStateAction<string | null>>;
};

function ObjectIcon({ type }: { type: SceneObject['type'] }) {
  if (type === 'Sphere') {
    return <SphereIcon />;
  }

  if (type === 'Cylinder') {
    return <CylinderIcon />;
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
  activeObjectId,
  setActiveObjectId
}: SceneSidebarProps) {
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
          <div className="min-w-0 flex-1 rounded-md border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-2.5 py-1 shadow-[var(--shadow-soft)]">
            <p className="truncate text-[0.86rem] font-semibold tracking-[-0.03em] text-[color:var(--text-primary)]">
              {scene.name}
            </p>
          </div>
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
                  <div className="flex items-center gap-0.5 text-[color:var(--text-secondary)]">
                    {element.visible !== false ? <EyeIcon /> : null}
                    {element.locked ? <LockIcon /> : null}
                  </div>
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
