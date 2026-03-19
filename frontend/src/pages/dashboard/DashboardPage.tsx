import { Link } from 'react-router-dom';
import {
  AppLogo,
  ArrowIcon,
  PlusIcon,
  SearchIcon,
} from '../../components/icons/DashboardIcons';
import ThemeToggle from '../../components/theme/ThemeToggle';
import { scenes } from '../../utils/scenes';
import PreviewThumbnail from './PreviewThumbnail';

function DashboardPage() {
  const accentClassNames = {
    blue: 'from-[var(--badge-blue-start)] via-[var(--badge-blue-mid)] to-[var(--badge-blue-end)]',
    stone:
      'from-[var(--badge-stone-start)] via-[var(--badge-stone-mid)] to-[var(--badge-stone-end)]',
    green:
      'from-[var(--badge-green-start)] via-[var(--badge-green-mid)] to-[var(--badge-green-end)]',
  } as const;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[color:var(--text-primary)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-6 py-6 backdrop-blur-xl lg:w-[280px] lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
          <div className="flex h-full flex-col justify-between gap-10">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <AppLogo />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                    Collab3D
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                    Scenes
                  </h1>
                </div>
              </div>

              <nav className="space-y-2">
                <div className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[color:var(--text-inverse)] shadow-[var(--shadow-soft)]">
                  Dashboard
                </div>
              </nav>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-6 py-6 lg:px-10 lg:py-8">
          <div className="flex max-w-[1440px] flex-col gap-6">
            <header className="flex flex-col gap-4 rounded-[32px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-card)] backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between lg:p-6">
              <label className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search scenes"
                  className="w-full border-none bg-transparent text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)]"
                />
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex hover:cursor-pointer items-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-sm font-medium text-[color:var(--accent-contrast)] shadow-[var(--shadow-soft)] transition hover:opacity-90"
                >
                  <PlusIcon />
                  Create scene
                </button>
                <ThemeToggle />
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] text-sm font-semibold text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)]">
                  H
                </div>
              </div>
            </header>

            <section className="rounded-[36px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-panel)] backdrop-blur-xl lg:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                    Workspace
                  </p>
                  <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
                    Scene dashboard
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
                    Open a scene, continue from where you left off, or start a new canvas for collaborative editing.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)]">
                    {scenes.length} active scenes
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                {scenes.map((scene) => (
                  <Link
                    key={scene.id}
                    to={`/scene/${scene.id}`}
                    className="group block rounded-[32px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)]"
                  >
                    <PreviewThumbnail
                      primary={scene.preview.primary}
                      secondary={scene.preview.secondary}
                      glow={scene.preview.glow}
                    />

                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <div
                          className={`inline-flex rounded-full bg-gradient-to-r ${accentClassNames[scene.accent]} px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[color:var(--text-inverse)]`}
                        >
                          Scene
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                          {scene.name}
                        </h3>
                        <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{scene.updatedAtLabel}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[color:var(--text-secondary)] transition group-hover:border-[color:var(--border-strong)] group-hover:bg-[var(--surface-strong)] group-hover:text-[color:var(--text-inverse)]">
                        <ArrowIcon />
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
                      <p className="text-sm text-[color:var(--text-secondary)]">
                        {scene.collaborators} collaborators
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
