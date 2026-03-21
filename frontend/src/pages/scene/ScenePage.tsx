import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeProvider";
import AddObjectBar from "./AddObjectBar";
import { SceneCanvas } from "./Canvas";
import SceneInspector from "./scene-inspector/SceneInspector";
import SceneSidebar from "./SceneSidebar";
import { getSceneById, updateScene } from "../../api/scenes";
import { SceneDetailsDto, SceneObjectDto } from "../../types/scenes";
import * as signalR from "@microsoft/signalr";

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const [scene, setScene] = useState<SceneDetailsDto | null>(null);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectDto[]>([]);
  const isDark = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const activeObject =
    sceneObjects.find((object) => object.id === activeObjectId) ?? null;

  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  const fetchScene = async () => {
    if (!sceneId) return;
    try {
      const scene = await getSceneById(sceneId);
      setScene(scene);
      setSceneObjects(scene.objects);
      console.log(scene.objects);
    } catch (error) {
      console.error("Failed to fetch scene", error);
    }
  };

  // Fetch the scene from database
  useEffect(() => {
    fetchScene();
  }, [sceneId]);

  // Connect user to scene with signalR api
  useEffect(() => {
    if (!sceneId) return;

    const userName =
      sessionStorage.getItem("sceneUserName") ??
      `Guest-${Math.floor(Math.random() * 1000)}`;

    sessionStorage.setItem("sceneUserName", userName);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7188/hubs/scene")
      .withAutomaticReconnect()
      .build();

    let isMounted = true;
    let started = false;

    connection.on("PresenceUpdated", (users: string[]) => {
      if (isMounted) {
        setConnectedUsers(users);
      }
    });

    const startConnection = async () => {
      try {
        await connection.start();
        started = true;

        if (!isMounted) return;

        await connection.invoke("JoinScene", sceneId, userName);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to connect to scene hub", error);
        }
      }
    };

    startConnection();

    console.log(connectedUsers);

    return () => {
      isMounted = false;

      if (started) {
        connection.invoke("LeaveScene", sceneId).catch(() => {});
        connection.stop().catch(() => {});
      }
    };
  }, [sceneId]);

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

  return (
    <div className="min-h-screen bg-(--bg-app) text-(--text-primary)">
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <SceneCanvas
            sceneId={sceneId ?? ""}
            isDark={isDark}
            sceneObjects={sceneObjects}
            activeObjectId={activeObjectId}
            setActiveObjectId={setActiveObjectId}
            setSceneObjects={setSceneObjects}
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
            setActiveObjectId={setActiveObjectId}
          />
        </aside>

        <aside className="absolute bottom-4 left-4 right-4 z-10 lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[264px]">
          <SceneInspector
            sceneId={sceneId ?? ""}
            activeObject={activeObject}
            setSceneObjects={setSceneObjects}
            setActiveObjectId={setActiveObjectId}
          />
        </aside>

        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <AddObjectBar
            sceneId={sceneId ?? ""}
            setSceneObjects={setSceneObjects}
            sceneObjects={sceneObjects}
            setActiveObjectId={setActiveObjectId}
          />
        </div>
      </div>
    </div>
  );
}

export default ScenePage;
