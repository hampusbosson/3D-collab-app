import { Grid, OrbitControls, PivotControls } from "@react-three/drei";
import { Canvas, type MeshProps, type ThreeEvent } from "@react-three/fiber";
import { useState, type Dispatch, type SetStateAction } from "react";
import { DoubleSide } from "three";
import type { SceneObject } from "../../types/scene";

interface ObjectMeshProps {
  object: SceneObject;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

function ObjectMesh({ object, setActiveObjectId }: ObjectMeshProps) {
  const handleObjectClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setActiveObjectId(object.id);
  };

  const meshProps: MeshProps = {
    castShadow: true,
    receiveShadow: true,
    onClick: handleObjectClick,
  };

  switch (object.type) {
    case "Sphere":
      return (
        <mesh {...meshProps}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial
            color={object.color}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
    case "Cylinder":
      return (
        <mesh {...meshProps}>
          <cylinderGeometry args={[0.65, 0.65, 1.5, 24]} />
          <meshStandardMaterial
            color={object.color}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
    case "Cone":
      return (
        <mesh {...meshProps}>
          <coneGeometry args={[0.75, 1.4, 24]} />
          <meshStandardMaterial
            color={object.color}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
    case "Pyramid":
      return (
        <mesh {...meshProps}>
          <coneGeometry args={[0.85, 1.5, 4]} />
          <meshStandardMaterial
            color={object.color}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
    case "Plane":
      return (
        <mesh {...meshProps} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 1.6]} />
          <meshStandardMaterial
            color={object.color}
            side={DoubleSide}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
    case "Cube":
    default:
      return (
        <mesh {...meshProps}>
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          <meshStandardMaterial
            color={object.color}
            transparent={object.opacity < 1}
            opacity={object.opacity}
          />
        </mesh>
      );
  }
}

interface RenderObjectProps {
  object: SceneObject;
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  setIsTransforming: Dispatch<SetStateAction<boolean>>;
}

function RenderObject({
  object,
  activeObjectId,
  setActiveObjectId,
  setIsTransforming,
}: RenderObjectProps) {
  if (object.id === activeObjectId) {
    return (
      <group
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
      >
        <PivotControls
          depthTest={false}
          anchor={[0, 0, 0]}
          onDragStart={() => setIsTransforming(true)}
          onDragEnd={() => setIsTransforming(false)}
        >
          <ObjectMesh
            object={object}
            setActiveObjectId={setActiveObjectId}
          />
        </PivotControls>
      </group>
    );
  }

  return (
    <group
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
    >
      <ObjectMesh
        object={object}
        setActiveObjectId={setActiveObjectId}
      />
    </group>
  );
}

interface SceneCanvasProps {
  isDark: boolean;
  sceneObjects: SceneObject[];
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
}

export function SceneCanvas({
  isDark,
  sceneObjects,
  activeObjectId,
  setActiveObjectId,
}: SceneCanvasProps) {
  const [isTransforming, setIsTransforming] = useState(false);

  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
      className="h-full w-full"
      onPointerMissed={() => setActiveObjectId(null)}
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
          setActiveObjectId={setActiveObjectId}
          setIsTransforming={setIsTransforming}
        />
      ))}
      <OrbitControls makeDefault enabled={!isTransforming} />
    </Canvas>
  );
}
