import { Canvas } from '@react-three/fiber';
import type { SceneObjectDto } from '../../types/scenes';
import { DoubleSide } from 'three';

interface PreviewThumbnailProps {
  objects: SceneObjectDto[];
}

function getPosition(object: SceneObjectDto): [number, number, number] {
  return [object.positionX, object.positionY, object.positionZ];
}

function getRotation(object: SceneObjectDto): [number, number, number] {
  return [object.rotationX, object.rotationY, object.rotationZ];
}

function getScale(object: SceneObjectDto): [number, number, number] {
  return [object.scaleX, object.scaleY, object.scaleZ];
}

function PreviewObject({ object }: { object: SceneObjectDto }) {
  const material = (
    <meshStandardMaterial
      color={object.color}
      transparent={object.opacity < 1}
      opacity={object.opacity}
      side={object.type === 'Plane' ? DoubleSide : undefined}
    />
  );

  switch (object.type) {
    case 'Sphere':
      return (
        <mesh
          position={getPosition(object)}
          rotation={getRotation(object)}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.75, 24, 24]} />
          {material}
        </mesh>
      );
    case 'Cylinder':
      return (
        <mesh
          position={getPosition(object)}
          rotation={getRotation(object)}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.65, 0.65, 1.5, 20]} />
          {material}
        </mesh>
      );
    case 'Cone':
      return (
        <mesh
          position={getPosition(object)}
          rotation={getRotation(object)}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[0.75, 1.4, 20]} />
          {material}
        </mesh>
      );
    case 'Pyramid':
      return (
        <mesh
          position={getPosition(object)}
          rotation={getRotation(object)}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <coneGeometry args={[0.85, 1.5, 4]} />
          {material}
        </mesh>
      );
    case 'Plane':
      return (
        <mesh
          position={getPosition(object)}
          rotation={[-Math.PI / 2 + object.rotationX, object.rotationY, object.rotationZ]}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[1.6, 1.6]} />
          {material}
        </mesh>
      );
    case 'Cube':
    default:
      return (
        <mesh
          position={getPosition(object)}
          rotation={getRotation(object)}
          scale={getScale(object)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          {material}
        </mesh>
      );
  }
}

function PreviewScene({ objects }: { objects: SceneObjectDto[] }) {
  return (
    <>
      <color attach="background" args={['#dbe4ef']} />
      <fog attach="fog" args={['#dbe4ef', 9, 16]} />
      <ambientLight intensity={1.35} />
      <directionalLight
        castShadow
        intensity={1.6}
        position={[6, 8, 4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight intensity={0.7} position={[-4, 6, -3]} color="#bfd6ff" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.02, 0]}>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.16} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#cfd8e3" />
      </mesh>
      {objects.map((object) => (
        <PreviewObject key={object.id} object={object} />
      ))}
    </>
  );
}

function PreviewThumbnail({ objects }: PreviewThumbnailProps) {
  return (
    <div className="relative h-40 w-full min-w-0 overflow-hidden rounded-[20px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,#eef4fa_0%,#d9e5f0_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_60px_rgba(148,163,184,0.24)] sm:h-52 sm:rounded-[28px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.65),transparent_52%)]" />
      <Canvas
        key={`${objects.length}-${objects.map((object) => object.id).join(':')}`}
        shadows
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [5.6, 4.8, 7.4], fov: 34 }}
        className="!block h-full w-full"
      >
        <PreviewScene objects={objects} />
      </Canvas>
      {objects.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-[rgba(255,255,255,0.7)] bg-[rgba(255,255,255,0.82)] px-3 py-1.5 text-[0.72rem] font-medium text-[color:var(--text-secondary)] shadow-[0_10px_24px_rgba(148,163,184,0.18)] backdrop-blur">
            Empty scene
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(217,229,240,0.28)_100%)]" />
    </div>
  );
}

export default PreviewThumbnail;
