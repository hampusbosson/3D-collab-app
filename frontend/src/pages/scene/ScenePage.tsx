import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeProvider";
import type { SceneObject } from "../../types/scene";
import { scenes } from "../../utils/scenes";
import AddObjectBar from "./AddObjectBar";
import { SceneCanvas } from "./Canvas";
import SceneInspector from "./SceneInspector";
import SceneSidebar from "./SceneSidebar";

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const scene = scenes.find((entry) => entry.id === sceneId) ?? scenes[0];
  const isDark = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const starterCube: SceneObject = {
    id: "cube-01",
    type: "Cube",
    name: "Starter Cube",
    position: [0, 0.7, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "#fb923c",
    opacity: 1,
  };

  const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([
    starterCube,
  ]);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  const activeObject =
    sceneObjects.find((object) => object.id === activeObjectId) ?? null;

  return (
    <div className="min-h-screen bg-(--bg-app) text-(--text-primary)">
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <SceneCanvas
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
            elements={[...sceneObjects]}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
            activeObjectId={activeObjectId}
            setActiveObjectId={setActiveObjectId}
          />
        </aside>

        <aside className="absolute bottom-4 left-4 right-4 z-10 lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[264px]">
          <SceneInspector
            activeObject={activeObject}
            setSceneObjects={setSceneObjects}
          />
        </aside>

        <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
          <AddObjectBar
            setSceneObjects={setSceneObjects}
            setActiveObjectId={setActiveObjectId}
          />
        </div>
      </div>
    </div>
  );
}

export default ScenePage;
