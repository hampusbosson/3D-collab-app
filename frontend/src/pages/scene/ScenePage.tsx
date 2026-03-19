import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeProvider";
import { scenes } from "../../utils/scenes";
import { SceneCanvas } from "./Canvas";
import SceneSidebar from "./SceneSidebar";
import type { SceneObject } from "./types";

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const scene = scenes.find((entry) => entry.id === sceneId) ?? scenes[0];
  const isDark = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // const starterCube: SceneObject = {
  //   id: "cube-01",
  //   type: "Cube",
  //   name: "Starter Cube",
  //   position: [0, 0.7, 0],
  //   color: "#fb923c",
  // };

  const starterObjects: SceneObject[] = [
    {
      id: "cube-01",
      type: "Cube",
      name: "Starter Cube",
      position: [0, 0.7, 0],
      color: "#fb923c",
    },
    {
      id: "cylinder-01",
      type: "Cylinder",
      name: "Starter Cylinder",
      position: [2, 0.7, 0],
      color: "#fb923c",
    },
    {
      id: "sphere-01",
      type: "Sphere",
      name: "Starter Sphere",
      position: [-2, 0.7, 0],
      color: "#fb923c",
    },
  ];

  const [sceneObjects, setSceneObjects] =
    useState<SceneObject[]>(starterObjects);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[color:var(--text-primary)]">
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <SceneCanvas isDark={isDark} sceneObjects={sceneObjects} activeObjectId={activeObjectId}/>
        </div>

        <aside
          className={`absolute left-4 right-4 top-4 z-10 lg:bottom-4 lg:left-4 lg:right-auto lg:top-4 ${
            sidebarCollapsed ? "lg:w-[44px]" : "lg:w-[216px]"
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

        <aside className="absolute bottom-4 left-4 right-4 z-10 border border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] p-6 backdrop-blur-xl lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[220px] lg:overflow-y-auto">
          <div className="space-y-6"></div>
        </aside>
      </div>
    </div>
  );
}

export default ScenePage;
