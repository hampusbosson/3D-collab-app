import { Grid, OrbitControls, PivotControls } from "@react-three/drei";
import { Canvas, type MeshProps, type ThreeEvent } from "@react-three/fiber";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { Matrix4, Vector3, Euler, Quaternion, DoubleSide } from "three";
import type { SceneObjectDto } from "../../types/scenes";

function getPosition(object: SceneObjectDto): [number, number, number] {
  return [object.positionX, object.positionY, object.positionZ];
}

function getRotation(object: SceneObjectDto): [number, number, number] {
  return [object.rotationX, object.rotationY, object.rotationZ];
}

function getScale(object: SceneObjectDto): [number, number, number] {
  return [object.scaleX, object.scaleY, object.scaleZ];
}

interface ObjectMeshProps {
  object: SceneObjectDto;
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
  object: SceneObjectDto;
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  setIsTransforming: Dispatch<SetStateAction<boolean>>;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

function RenderObject({
  object,
  activeObjectId,
  setActiveObjectId,
  setIsTransforming,
  setSceneObjects,
}: RenderObjectProps) {
  // Stores the latest drag delta reported by PivotControls during the current interaction.
  const dragMatrixRef = useRef(new Matrix4());
  // Remounts PivotControls after a committed transform so its internal delta resets cleanly.
  const pivotKey = [
    object.id,
    object.positionX,
    object.positionY,
    object.positionZ,
    object.rotationX,
    object.rotationY,
    object.rotationZ,
    object.scaleX,
    object.scaleY,
    object.scaleZ,
  ].join(",");

  // Combines the object's saved transform with the latest drag delta and writes the result to React state.
  const commitTransform = () => {
    const basePosition = new Vector3(...getPosition(object));
    const baseRotation = new Euler(...getRotation(object));
    const baseQuaternion = new Quaternion().setFromEuler(baseRotation);
    const baseScale = new Vector3(...getScale(object));
    const baseMatrix = new Matrix4().compose(
      basePosition,
      baseQuaternion,
      baseScale,
    );
    const position = new Vector3();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    baseMatrix.multiply(dragMatrixRef.current);
    baseMatrix.decompose(position, quaternion, scale);

    const rotation = new Euler().setFromQuaternion(quaternion);

    setSceneObjects((objects) =>
      objects.map((entry) =>
        entry.id === object.id
          ? {
              ...entry,
              positionX: position.x,
              positionY: position.y,
              positionZ: position.z,
              rotationX: rotation.x,
              rotationY: rotation.y,
              rotationZ: rotation.z,
              scaleX: scale.x,
              scaleY: scale.y,
              scaleZ: scale.z,
            }
          : entry
      ),
    );
  };

  if (object.id === activeObjectId) {
    return (
      <group
        position={getPosition(object)}
        rotation={getRotation(object)}
        scale={getScale(object)}
      >
        <PivotControls
          key={pivotKey}
          depthTest={false}
          anchor={[0, 0, 0]}
          onDragStart={() => {
            // Start each drag from a clean identity matrix and pause camera orbit while transforming.
            dragMatrixRef.current.identity();
            setIsTransforming(true);
          }}
          onDrag={(localMatrix) => {
            // Keep the most recent drag delta so it can be committed once on drag end.
            dragMatrixRef.current.copy(localMatrix);
          }}
          onDragEnd={() => {
            // Persist the final transform to scene state, then re-enable orbit controls.
            commitTransform();
            setIsTransforming(false);
          }}
        >
          <ObjectMesh object={object} setActiveObjectId={setActiveObjectId} />
        </PivotControls>
      </group>
    );
  }

  return (
    <group
      position={getPosition(object)}
      rotation={getRotation(object)}
      scale={getScale(object)}
    >
      <ObjectMesh object={object} setActiveObjectId={setActiveObjectId} />
    </group>
  );
}

interface SceneCanvasProps {
  isDark: boolean;
  sceneObjects: SceneObjectDto[];
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

export function SceneCanvas({
  isDark,
  sceneObjects,
  activeObjectId,
  setActiveObjectId,
  setSceneObjects,
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
          setSceneObjects={setSceneObjects}
        />
      ))}
      <OrbitControls makeDefault enabled={!isTransforming} />
    </Canvas>
  );
}
