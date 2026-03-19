import { Grid, OrbitControls, PivotControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { SceneObject } from "./types";

interface RenderObjectProps {
  object: SceneObject;
  activeObjectId: string | null;
}

function ObjectMesh({ object }: { object: SceneObject }) {
  switch (object.type) {
    case "Sphere":
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
    case "Cylinder":
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 1.5, 24]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
    case "Cube":
    default:
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
  }
}

function RenderObject({ object, activeObjectId }: RenderObjectProps) {
  if (object.id === activeObjectId) {
    return (
      <PivotControls depthTest={false} anchor={[0,0,0]}>
        <ObjectMesh object={object} />
      </PivotControls>
    );
  }

  return <ObjectMesh object={object} />;
}

interface SceneCanvasProps {
  isDark: boolean;
  sceneObjects: SceneObject[];
  activeObjectId: string | null;
}

export function SceneCanvas({
  isDark,
  sceneObjects,
  activeObjectId,
}: SceneCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={[isDark ? "#0f172a" : "#dbe4ef"]} />
      <ambientLight intensity={isDark ? 1.2 : 1.5} />
      <directionalLight
        castShadow
        intensity={isDark ? 1.5 : 1.8}
        position={[6, 8, 4]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid
        args={[30, 30]}
        cellColor={isDark ? "#334155" : "#cbd5e1"}
        sectionColor={isDark ? "#64748b" : "#94a3b8"}
        fadeDistance={45}
        fadeStrength={1.2}
        position={[0, 0.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      {sceneObjects.map((object) => (
        <RenderObject
          key={object.id}
          object={object}
          activeObjectId={activeObjectId}
        />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
}
