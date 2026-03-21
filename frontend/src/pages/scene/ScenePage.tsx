import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../../components/theme/ThemeProvider";
import AddObjectBar from "./AddObjectBar";
import { SceneCanvas } from "./Canvas";
import SceneInspector from "./scene-inspector/SceneInspector";
import SceneSidebar from "./SceneSidebar";
import { getSceneById } from "../../api/scenes";
import { SceneDetailsDto, SceneObjectDto } from "../../types/scenes";

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const [scene, setScene] = useState<SceneDetailsDto | null>(null);
  const [sceneObjects, setSceneObjects] = useState<SceneObjectDto[]>([]);
  const isDark = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const fetchScene = async() => {
    if (!sceneId) return;
    try {
      const scene = await getSceneById(sceneId);
      setScene(scene);
      setSceneObjects(scene.objects);
      console.log(scene.objects)
    } catch (error) {
      console.error("Failed to fetch scene", error);
    }
  }

  // Fetch the scene from database
  useEffect(() => {
    fetchScene()
  }, [sceneId]);


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
            elements={sceneObjects}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
            activeObjectId={activeObjectId}
            setActiveObjectId={setActiveObjectId}
          />
        </aside>

        <aside className="absolute bottom-4 left-4 right-4 z-10 lg:bottom-4 lg:left-auto lg:right-4 lg:top-4 lg:w-[264px]">
          <SceneInspector
            sceneId={sceneId}
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
