import {
  AppLogo,
  PlusIcon,
  SearchIcon,
} from "../../components/icons/DashboardIcons";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { createScene, deleteScene, getScenes } from "../../api/scenes";
import { SceneDto } from "../../types/scenes";
import { useEffect, useState } from "react";
import DeleteSceneModal from "./DeleteSceneModal";
import SceneCard from "./SceneCard";

function DashboardPage() {
  const navigate = useNavigate();
  const [scenes, setScenes] = useState<SceneDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scenePendingDelete, setScenePendingDelete] = useState<SceneDto | null>(
    null,
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeletingScene, setIsDeletingScene] = useState(false);

  useEffect(() => {
    loadScenes();
  }, []);

  const loadScenes = async () => {
    try {
      const scenesData = await getScenes();
      setScenes(scenesData);
    } catch (error) {
      console.error("Failed to load scenes", error);
    }
  };

  const handleCreateScene = async (name: string) => {
    try {
      const newScene = await createScene({ name });
      setScenes((prev) => [newScene, ...prev]);
      navigate(`/scene/${newScene.id}`);
    } catch (error) {
      console.error("Failed to create scene", error);
    }
  };

  const handleOpenDeleteModal = (scene: SceneDto) => {
    setDeleteError(null);
    setScenePendingDelete(scene);
  };

  const handleCloseDeleteModal = () => {
    setDeleteError(null);
    setScenePendingDelete(null);
  };

  const handleConfirmDelete = async (sceneId: string) => {
    setDeleteError(null);
    setIsDeletingScene(true);

    try {
      await deleteScene(sceneId);

      setScenes((previousScenes) =>
        previousScenes.filter((scene) => scene.id !== sceneId),
      );

      setScenePendingDelete(null);
    } catch (error) {
      console.error("Failed to delete scene", error);
      setDeleteError("Could not delete this scene. Please try again.");
    } finally {
      setIsDeletingScene(false);
    }
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredScenes = scenes.filter((scene) =>
    scene.name.toLowerCase().includes(normalizedSearchQuery),
  );

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[color:var(--text-primary)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full border-b border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-4 py-5 backdrop-blur-xl sm:px-6 sm:py-6 lg:w-[280px] lg:border-b-0 lg:border-r lg:px-8 lg:py-8">
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
                <div className="rounded-2xl bg-[var(--surface-strong)] px-4 py-3 text-sm font-medium text-[color:var(--text-on-strong)] shadow-[var(--shadow-soft)]">
                  Dashboard
                </div>
              </nav>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
          <div className="flex max-w-[1440px] flex-col gap-6">
            <header className="flex flex-col gap-4 rounded-[26px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)] backdrop-blur-xl sm:rounded-[32px] sm:p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
              <label className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-4 py-3">
                <SearchIcon />
                <input
                  type="search"
                  placeholder="Search scenes"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full border-none bg-transparent text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-muted)]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCreateScene("untitled")}
                  className="inline-flex hover:cursor-pointer items-center gap-2 rounded-2xl bg-[var(--accent-primary)] px-4 py-3 text-sm font-medium text-[color:var(--accent-contrast)] shadow-[var(--shadow-soft)] transition hover:opacity-90"
                >
                  <PlusIcon />
                  Create scene
                </button>
                <ThemeToggle />
              </div>
            </header>

            <section className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:rounded-[36px] sm:p-5 lg:p-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                    Workspace
                  </p>
                  <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-[color:var(--text-primary)] sm:text-4xl">
                    Scene dashboard
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]">
                    Open a scene, continue from where you left off, or start a
                    new canvas for collaborative editing.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)]">
                    {filteredScenes.length} active scenes
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-4 sm:mt-8 sm:gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                {scenes.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-[var(--surface-elevated)] px-6 py-12 text-center shadow-[var(--shadow-soft)] xl:col-span-2 2xl:col-span-3">
                    <p className="text-base font-semibold text-[color:var(--text-primary)]">
                      No scenes yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                      Create your first scene to start building and collaborating
                      in 3D.
                    </p>
                  </div>
                ) : filteredScenes.length === 0 ? (
                  <div className="rounded-[28px] border border-dashed border-[color:var(--border-strong)] bg-[var(--surface-elevated)] px-6 py-12 text-center shadow-[var(--shadow-soft)] xl:col-span-2 2xl:col-span-3">
                    <p className="text-base font-semibold text-[color:var(--text-primary)]">
                      No matching scenes
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
                      Try a different name or clear the search to see all scenes.
                    </p>
                  </div>
                ) : (
                  filteredScenes.map((scene) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      onDeleteClick={handleOpenDeleteModal}
                    />
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>

      <DeleteSceneModal
        scene={scenePendingDelete}
        isOpen={scenePendingDelete !== null}
        errorMessage={deleteError}
        isDeleting={isDeletingScene}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default DashboardPage;
