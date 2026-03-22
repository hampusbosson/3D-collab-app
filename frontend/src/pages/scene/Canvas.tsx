import { Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { Canvas, type MeshProps, type ThreeEvent, useThree } from "@react-three/fiber";
import type { HubConnection } from "@microsoft/signalr";
import { useEffect, useState, type Dispatch, type MutableRefObject, type SetStateAction } from "react";
import { DoubleSide, Group } from "three";
import type { SceneObjectDto, UpdateSceneObjectDto } from "../../types/scenes";

const transformModes = ["translate", "rotate", "scale"] as const;
type TransformMode = (typeof transformModes)[number];

function getPosition(object: SceneObjectDto): [number, number, number] {
  return [object.positionX, object.positionY, object.positionZ];
}

function getRotation(object: SceneObjectDto): [number, number, number] {
  return [object.rotationX, object.rotationY, object.rotationZ];
}

function getScale(object: SceneObjectDto): [number, number, number] {
  return [object.scaleX, object.scaleY, object.scaleZ];
}

function createUpdatePayload(object: SceneObjectDto): UpdateSceneObjectDto {
  return {
    type: object.type,
    name: object.name,
    positionX: object.positionX,
    positionY: object.positionY,
    positionZ: object.positionZ,
    rotationX: object.rotationX,
    rotationY: object.rotationY,
    rotationZ: object.rotationZ,
    scaleX: object.scaleX,
    scaleY: object.scaleY,
    scaleZ: object.scaleZ,
    color: object.color,
    opacity: object.opacity,
  };
}

function buildObjectFromGroup(group: Group, object: SceneObjectDto): SceneObjectDto {
  return {
    ...object,
    positionX: group.position.x,
    positionY: group.position.y,
    positionZ: group.position.z,
    rotationX: group.rotation.x,
    rotationY: group.rotation.y,
    rotationZ: group.rotation.z,
    scaleX: group.scale.x,
    scaleY: group.scale.y,
    scaleZ: group.scale.z,
  };
}

interface ObjectMeshProps {
  object: SceneObjectDto;
  isActive: boolean;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  onCycleTransformMode: () => void;
}

function ObjectMaterial({
  object,
  doubleSided = false,
}: {
  object: SceneObjectDto;
  doubleSided?: boolean;
}) {
  const materialKey = `${object.id}-${object.color}-${object.opacity < 1 ? "transparent" : "opaque"}`;

  return (
    <meshStandardMaterial
      key={materialKey}
      color={object.color}
      side={doubleSided ? DoubleSide : undefined}
      transparent={object.opacity < 1}
      opacity={object.opacity}
    />
  );
}

function ObjectMesh({
  object,
  isActive,
  setActiveObjectId,
  onCycleTransformMode,
}: ObjectMeshProps) {
  const handleObjectClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    setActiveObjectId(object.id);
  };

  const handleContextMenu = (event: ThreeEvent<MouseEvent>) => {
    if (!isActive) {
      return;
    }

    event.stopPropagation();
    event.nativeEvent.preventDefault();
    onCycleTransformMode();
  };

  const meshProps: MeshProps = {
    castShadow: true,
    receiveShadow: true,
    onClick: handleObjectClick,
    onContextMenu: handleContextMenu,
  };

  switch (object.type) {
    case "Sphere":
      return (
        <mesh {...meshProps}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <ObjectMaterial object={object} />
        </mesh>
      );
    case "Cylinder":
      return (
        <mesh {...meshProps}>
          <cylinderGeometry args={[0.65, 0.65, 1.5, 24]} />
          <ObjectMaterial object={object} />
        </mesh>
      );
    case "Cone":
      return (
        <mesh {...meshProps}>
          <coneGeometry args={[0.75, 1.4, 24]} />
          <ObjectMaterial object={object} />
        </mesh>
      );
    case "Pyramid":
      return (
        <mesh {...meshProps}>
          <coneGeometry args={[0.85, 1.5, 4]} />
          <ObjectMaterial object={object} />
        </mesh>
      );
    case "Plane":
      return (
        <mesh {...meshProps} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 1.6]} />
          <ObjectMaterial object={object} doubleSided />
        </mesh>
      );
    case "Cube":
    default:
      return (
        <mesh {...meshProps}>
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          <ObjectMaterial object={object} />
        </mesh>
      );
  }
}

interface RenderObjectProps {
  object: SceneObjectDto;
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  onCycleTransformMode: () => void;
}

function RenderObject({
  object,
  activeObjectId,
  setActiveObjectId,
  onCycleTransformMode,
}: RenderObjectProps) {
  return (
    <group
      name={object.id}
      position={getPosition(object)}
      rotation={getRotation(object)}
      scale={getScale(object)}
    >
      <ObjectMesh
        object={object}
        isActive={object.id === activeObjectId}
        setActiveObjectId={setActiveObjectId}
        onCycleTransformMode={onCycleTransformMode}
      />
    </group>
  );
}

interface ActiveTransformControlsProps {
  sceneId: string;
  activeObjectId: string | null;
  activeObject: SceneObjectDto | null;
  mode: TransformMode;
  connectionRef: MutableRefObject<HubConnection | null>;
  setIsTransformDragging: Dispatch<SetStateAction<boolean>>;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

function ActiveTransformControls({
  sceneId,
  activeObjectId,
  activeObject,
  mode,
  connectionRef,
  setIsTransformDragging,
  setSceneObjects,
}: ActiveTransformControlsProps) {
  const scene = useThree((state) => state.scene);
  const [target, setTarget] = useState<Group | null>(null);

  useEffect(() => {
    if (!activeObjectId || !activeObject) {
      setTarget(null);
      return;
    }

    setTarget(scene.getObjectByName(activeObjectId) as Group | null);
  }, [scene, activeObjectId, activeObject]);

  if (!activeObjectId || !activeObject || !target) {
    return null;
  }

  const syncTransformToState = () => {
    const nextObject = buildObjectFromGroup(target, activeObject);

    setSceneObjects((objects) =>
      objects.map((entry) => (entry.id === activeObject.id ? nextObject : entry)),
    );
  };

  const persistTransform = async () => {
    const nextObject = buildObjectFromGroup(target, activeObject);

    setSceneObjects((objects) =>
      objects.map((entry) => (entry.id === activeObject.id ? nextObject : entry)),
    );

    try {
      await connectionRef.current?.invoke(
        "UpdateObject",
        sceneId,
        activeObject.id,
        createUpdatePayload(nextObject),
      );
    } catch (error) {
      console.error("Failed to persist object transform", error);
    }
  };

  return (
    <TransformControls
      object={target}
      mode={mode}
      onMouseDown={() => {
        setIsTransformDragging(true);
      }}
      onObjectChange={syncTransformToState}
      onMouseUp={() => {
        setIsTransformDragging(false);
        void persistTransform();
      }}
    />
  );
}

interface SceneCanvasProps {
  sceneId: string;
  isDark: boolean;
  connectionRef: MutableRefObject<HubConnection | null>;
  sceneObjects: SceneObjectDto[];
  activeObjectId: string | null;
  setActiveObjectId: Dispatch<SetStateAction<string | null>>;
  setSceneObjects: Dispatch<SetStateAction<SceneObjectDto[]>>;
}

export function SceneCanvas({
  sceneId,
  isDark,
  connectionRef,
  sceneObjects,
  activeObjectId,
  setActiveObjectId,
  setSceneObjects,
}: SceneCanvasProps) {
  const [transformModeIndex, setTransformModeIndex] = useState(0);
  const [isTransformDragging, setIsTransformDragging] = useState(false);
  const transformMode = transformModes[transformModeIndex];
  const activeObject =
    sceneObjects.find((object) => object.id === activeObjectId) ?? null;

  const cycleTransformMode = () => {
    setTransformModeIndex((currentIndex) =>
      (currentIndex + 1) % transformModes.length,
    );
  };

  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
      className="h-full w-full"
      onContextMenu={(event) => event.preventDefault()}
      onPointerMissed={(event) => {
        if (event.button !== 0) {
          return;
        }

        if (isTransformDragging) {
          return;
        }

        setActiveObjectId(null);
      }}
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
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onPointerUp={(event) => {
          event.stopPropagation();

          if (event.button !== 0) {
            return;
          }

          if (isTransformDragging) {
            return;
          }

          setActiveObjectId(null);
        }}
      >
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      {sceneObjects.map((object) => (
        <RenderObject
          key={object.id}
          object={object}
          activeObjectId={activeObjectId}
          setActiveObjectId={setActiveObjectId}
          onCycleTransformMode={cycleTransformMode}
        />
      ))}
      <ActiveTransformControls
        sceneId={sceneId}
        activeObjectId={activeObjectId}
        activeObject={activeObject}
        mode={transformMode}
        connectionRef={connectionRef}
        setIsTransformDragging={setIsTransformDragging}
        setSceneObjects={setSceneObjects}
      />
      <OrbitControls makeDefault />
    </Canvas>
  );
}
