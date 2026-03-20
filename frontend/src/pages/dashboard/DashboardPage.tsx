import {
  AppLogo,
  PlusIcon,
  SearchIcon,
} from "../../components/icons/DashboardIcons";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { createScene, deleteScene, getScenes } from "../../api/scenes";
import { SceneDto } from "../../types/scenes";
import { useEffect, useState } from "react";
import DeleteSceneModal from "./DeleteSceneModal";
import SceneCard from "./SceneCard";

function DashboardPage() {
  const [scenes, setScenes] = useState<SceneDto[]>([]);
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
      console.log("scene created: ", newScene.name);
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
                  onClick={() => handleCreateScene("untitled")}
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
                    Open a scene, continue from where you left off, or start a
                    new canvas for collaborative editing.
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
                  <SceneCard
                    key={scene.id}
                    scene={scene}
                    onDeleteClick={handleOpenDeleteModal}
                  />
                ))}
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
