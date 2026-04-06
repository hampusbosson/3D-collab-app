import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { HelpCircleIcon } from "../../components/icons/SceneIcons";
import { useTheme } from "../../components/theme/ThemeProvider";
import AddObjectBar from "./AddObjectBar";
import { SceneCanvas } from "./Canvas";
import SceneOnboardingModal from "./SceneOnboardingModal";
import SceneInspector from "./scene-inspector/SceneInspector";
import SceneSidebar from "./SceneSidebar";
import { getSceneById, updateScene } from "../../api/scenes";
import type { PrimitiveType } from "../../types/scene";
import { LiveSelection, SceneDetailsDto, SceneObjectDto } from "../../types/scenes";
import * as signalR from "@microsoft/signalr";
import { signalRHubUrl } from "../../utils/env";
import {
  areSceneObjectsEqual,
  createSceneObject,
  upsertSceneObject,
} from "../../utils/sceneObjects";

const sceneOnboardingPreferenceKey = "scene-onboarding-hidden";

type SceneMutation =
  | { type: "upsert"; object: SceneObjectDto }
  | { type: "delete"; object: SceneObjectDto };

type HistoryEntry = {
  undo: SceneMutation;
  redo: SceneMutation;
  selectionAfterUndo: string | null;
  selectionAfterRedo: string | null;
};

function applySceneMutationLocally(
  objects: SceneObjectDto[],
  mutation: SceneMutation,
) {
  if (mutation.type === "upsert") {
    return upsertSceneObject(objects, mutation.object);
  }

  return objects.filter((object) => object.id !== mutation.object.id);
}

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const [scene, setScene] = useState<SceneDetailsDto | null>(null);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectDto[]>([]);
  const isDark = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dontShowOnboardingAgain, setDontShowOnboardingAgain] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const [currentUserName] = useState(() => {
    const existingUserName = sessionStorage.getItem("sceneUserName");

    if (existingUserName) {
      return existingUserName;
    }

    const generatedUserName = `Guest-${Math.floor(Math.random() * 1000)}`;
    sessionStorage.setItem("sceneUserName", generatedUserName);
    return generatedUserName;
  });
  const activeObject =
    sceneObjects.find((object) => object.id === activeObjectId) ?? null;

  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [liveSelections, setLiveSelections] = useState<LiveSelection[]>([]);
  const [historyPast, setHistoryPast] = useState<HistoryEntry[]>([]);
  const [historyFuture, setHistoryFuture] = useState<HistoryEntry[]>([]);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const activeObjectIdRef = useRef<string | null>(null);
  const skipNextSelectionBroadcastRef = useRef<string | null>(null);

  useEffect(() => {
    activeObjectIdRef.current = activeObjectId;
  }, [activeObjectId]);

  const fetchScene = async () => {
    if (!sceneId) return;
    try {
      const scene = await getSceneById(sceneId);
      setScene(scene);
      setSceneObjects(scene.objects);
      setHistoryPast([]);
      setHistoryFuture([]);
      setActiveObjectId(null);
    } catch (error) {
      console.error("Failed to fetch scene", error);
    }
  };

  // Fetch the scene from database
  useEffect(() => {
    fetchScene();
  }, [sceneId]);

  useEffect(() => {
    const shouldHideOnboarding =
      localStorage.getItem(sceneOnboardingPreferenceKey) === "true";

    setDontShowOnboardingAgain(shouldHideOnboarding);
    setIsOnboardingOpen(!shouldHideOnboarding);
  }, []);

  // Connect user to scene with signalR api
  useEffect(() => {
    if (!sceneId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(signalRHubUrl)
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    let isMounted = true;
    let started = false;

    connection.on("PresenceUpdated", (users: string[]) => {
      if (isMounted) {
        setConnectedUsers(users);
      }
    });

    connection.on("SelectionUpdated", (selections: LiveSelection[]) => {
      if (isMounted) {
        setLiveSelections(selections);
      }
    });

    connection.on("ObjectUpdated", (updatedObject: SceneObjectDto) => {
      setSceneObjects((currentObjects) =>
        upsertSceneObject(currentObjects, updatedObject),
      );
    });

    connection.on("ObjectAdded", (addedObject: SceneObjectDto) => {
      setSceneObjects((currentObjects) =>
        upsertSceneObject(currentObjects, addedObject),
      );
    });

    connection.on("ObjectDeleted", (objectId: string) => {
      setSceneObjects((currentObjects) =>
        currentObjects.filter((object) => object.id !== objectId),
      );
      setActiveObjectId((currentActiveObjectId) =>
        currentActiveObjectId === objectId ? null : currentActiveObjectId,
      );
    });

    const startConnection = async () => {
      try {
        await connection.start();
        started = true;

        if (!isMounted) return;

        await connection.invoke("JoinScene", sceneId, currentUserName);
        await connection.invoke("UpdateSelection", sceneId, activeObjectIdRef.current);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to connect to scene hub", error);
        }
      }
    };

    connection.onreconnected(() => {
      void (async () => {
        try {
          await connection.invoke("JoinScene", sceneId, currentUserName);
          await connection.invoke("UpdateSelection", sceneId, activeObjectIdRef.current);
        } catch (error) {
          if (isMounted) {
            console.error("Failed to restore scene presence", error);
          }
        }
      })();
    });

    void startConnection();

    return () => {
      isMounted = false;

      if (started) {
        connection.invoke("LeaveScene", sceneId).catch(() => {});
        connection.stop().catch(() => {});
      }
    };
  }, [sceneId, currentUserName]);

  useEffect(() => {
    if (!sceneId) {
      return;
    }

    if (
      activeObjectId !== null &&
      skipNextSelectionBroadcastRef.current === activeObjectId
    ) {
      skipNextSelectionBroadcastRef.current = null;
      return;
    }

    const connection = connectionRef.current;
    if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
      return;
    }

    connection.invoke("UpdateSelection", sceneId, activeObjectId).catch((error) => {
      console.error("Failed to sync active selection", error);
    });
  }, [activeObjectId, sceneId]);

  const applyMutation = (mutation: SceneMutation) => {
    setSceneObjects((currentObjects) =>
      applySceneMutationLocally(currentObjects, mutation),
    );
  };

  const persistMutation = async (mutation: SceneMutation) => {
    if (!sceneId) {
      return;
    }

    try {
      if (mutation.type === "upsert") {
        await connectionRef.current?.invoke("UpsertObject", sceneId, mutation.object);
        return;
      }

      await connectionRef.current?.invoke("DeleteObject", sceneId, mutation.object.id);
    } catch (error) {
      console.error("Failed to persist scene mutation", error);
    }
  };

  const pushHistory = (entry: HistoryEntry) => {
    setHistoryPast((currentHistory) => [...currentHistory.slice(-49), entry]);
    setHistoryFuture([]);
  };

  const commitObjectChange = async (
    previousObject: SceneObjectDto,
    nextObject: SceneObjectDto,
  ) => {
    if (areSceneObjectsEqual(previousObject, nextObject)) {
      return;
    }

    applyMutation({ type: "upsert", object: nextObject });
    pushHistory({
      undo: { type: "upsert", object: previousObject },
      redo: { type: "upsert", object: nextObject },
      selectionAfterUndo: previousObject.id,
      selectionAfterRedo: nextObject.id,
    });
    setActiveObjectId(nextObject.id);
    await persistMutation({ type: "upsert", object: nextObject });
  };

  const handlePreviewObject = (nextObject: SceneObjectDto) => {
    applyMutation({ type: "upsert", object: nextObject });
  };

  const handleCommitObject = async (nextObject: SceneObjectDto) => {
    const previousObject = sceneObjects.find((object) => object.id === nextObject.id);

    if (!previousObject) {
      return;
    }

    await commitObjectChange(previousObject, nextObject);
  };

  const handleCommitTransform = async (
    previousObject: SceneObjectDto,
    nextObject: SceneObjectDto,
  ) => {
    await commitObjectChange(previousObject, nextObject);
  };

  const handleAddObject = async (type: PrimitiveType) => {
    if (!sceneId) {
      return;
    }

    const newObject = createSceneObject(
      sceneId,
      type,
      sceneObjects.length,
      currentUserName,
    );

    applyMutation({ type: "upsert", object: newObject });
    pushHistory({
      undo: { type: "delete", object: newObject },
      redo: { type: "upsert", object: newObject },
      selectionAfterUndo: null,
      selectionAfterRedo: newObject.id,
    });
    skipNextSelectionBroadcastRef.current = newObject.id;
    setActiveObjectId(newObject.id);
    await persistMutation({ type: "upsert", object: newObject });
  };

  const handleDeleteObject = async (object: SceneObjectDto) => {
    applyMutation({ type: "delete", object });
    pushHistory({
      undo: { type: "upsert", object },
      redo: { type: "delete", object },
      selectionAfterUndo: object.id,
      selectionAfterRedo: null,
    });
    setActiveObjectId((currentActiveObjectId) =>
      currentActiveObjectId === object.id ? null : currentActiveObjectId,
    );
    await persistMutation({ type: "delete", object });
  };

  const handleUndo = async () => {
    const entry = historyPast[historyPast.length - 1];

    if (!entry) {
      return;
    }

    setHistoryPast((currentHistory) => currentHistory.slice(0, -1));
    setHistoryFuture((currentHistory) => [entry, ...currentHistory]);
    applyMutation(entry.undo);
    setActiveObjectId(entry.selectionAfterUndo);
    await persistMutation(entry.undo);
  };

  const handleRedo = async () => {
    const entry = historyFuture[0];

    if (!entry) {
      return;
    }

    setHistoryFuture((currentHistory) => currentHistory.slice(1));
    setHistoryPast((currentHistory) => [...currentHistory.slice(-49), entry]);
    applyMutation(entry.redo);
    setActiveObjectId(entry.selectionAfterRedo);
    await persistMutation(entry.redo);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (isTypingTarget) {
        return;
      }

      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (!isModifierPressed) {
        return;
      }

      if (event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault();
        void handleRedo();
        return;
      }

      if (event.key.toLowerCase() === "z") {
        event.preventDefault();
        void handleUndo();
        return;
      }

      if (event.key.toLowerCase() === "y") {
        event.preventDefault();
        void handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [historyPast, historyFuture, sceneObjects]);

  const handleSceneNameCommit = async (nextName: string) => {
    if (!sceneId || !scene) return;

    const previousName = scene.name;

    setScene((currentScene) =>
      currentScene
        ? {
            ...currentScene,
            name: nextName,
          }
        : currentScene,
    );

    try {
      const updatedScene = await updateScene(sceneId, { name: nextName });

      setScene((currentScene) =>
        currentScene
          ? {
              ...currentScene,
              name: updatedScene.name,
              updatedAt: updatedScene.updatedAt,
            }
          : currentScene,
      );
    } catch (error) {
      setScene((currentScene) =>
        currentScene
          ? {
              ...currentScene,
              name: previousName,
            }
          : currentScene,
      );

      console.error("Failed to rename scene", error);
    }
  };

  const handleOnboardingClose = () => {
    localStorage.setItem(
      sceneOnboardingPreferenceKey,
      String(dontShowOnboardingAgain),
    );
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen bg-(--bg-app) text-(--text-primary)">
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <SceneCanvas
            isDark={isDark}
            sceneObjects={sceneObjects}
            currentUserName={currentUserName}
            liveSelections={liveSelections}
            activeObjectId={activeObjectId}
            setActiveObjectId={setActiveObjectId}
            onPreviewObject={handlePreviewObject}
            onCommitObject={handleCommitTransform}
          />
        </div>

        <aside
          className={`absolute left-4 right-4 top-4 z-10 lg:bottom-4 lg:left-4 lg:right-auto lg:top-4 ${
            sidebarCollapsed ? "lg:w-11" : "lg:w-54"
          }`}
        >
          <SceneSidebar
            scene={scene}
            users={connectedUsers}
            elements={sceneObjects}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
            onSceneNameCommit={handleSceneNameCommit}
            activeObjectId={activeObjectId}
            currentUserName={currentUserName}
            liveSelections={liveSelections}
            setActiveObjectId={setActiveObjectId}
          />
        </aside>

        <aside className="absolute bottom-4 left-4 right-4 z-10 lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[264px]">
          <SceneInspector
            activeObject={activeObject}
            onCommitObject={handleCommitObject}
            onDeleteObject={handleDeleteObject}
          />
        </aside>

        <div className="absolute right-4 top-4 z-10 flex items-center gap-2 lg:right-72">
          <button
            type="button"
            aria-label="Undo last change"
            onClick={() => void handleUndo()}
            disabled={historyPast.length === 0}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-2 text-[0.72rem] font-medium text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>Undo</span>
            <span className="text-[0.62rem] text-[color:var(--text-muted)]">Ctrl+Z</span>
          </button>
          <button
            type="button"
            aria-label="Redo last undone change"
            onClick={() => void handleRedo()}
            disabled={historyFuture.length === 0}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] px-3 py-2 text-[0.72rem] font-medium text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>Redo</span>
            <span className="text-[0.62rem] text-[color:var(--text-muted)]">Ctrl+Y</span>
          </button>
          <button
            type="button"
            aria-label="Open scene help"
            onClick={() => setIsOnboardingOpen(true)}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] backdrop-blur-xl transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
          >
            <HelpCircleIcon />
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <AddObjectBar onAddObject={(type) => void handleAddObject(type)} />
        </div>
      </div>

      <SceneOnboardingModal
        isOpen={isOnboardingOpen}
        dontShowAgain={dontShowOnboardingAgain}
        onDontShowAgainChange={setDontShowOnboardingAgain}
        onClose={handleOnboardingClose}
      />
    </div>
  );
}

export default ScenePage;
