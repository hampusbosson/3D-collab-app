import { Canvas } from '@react-three/fiber';
import { Grid, OrbitControls } from '@react-three/drei';

type PrimitiveType = 'Cube' | 'Sphere' | 'Cylinder';

type SceneObject = {
  id: string;
  type: PrimitiveType;
  name: string;
  position: [number, number, number];
  color: string;
};

const objects: SceneObject[] = [
  {
    id: 'cube-01',
    type: 'Cube',
    name: 'Starter Cube',
    position: [-2, 0.5, 0],
    color: '#f97316',
  },
  {
    id: 'sphere-01',
    type: 'Sphere',
    name: 'Starter Sphere',
    position: [0, 0.75, 0],
    color: '#14b8a6',
  },
  {
    id: 'cylinder-01',
    type: 'Cylinder',
    name: 'Starter Cylinder',
    position: [2, 0.75, 0],
    color: '#3b82f6',
  },
];

function PrimitivePreview({ object }: { object: SceneObject }) {
  switch (object.type) {
    case 'Sphere':
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
    case 'Cylinder':
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <cylinderGeometry args={[0.65, 0.65, 1.5, 24]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
    case 'Cube':
    default:
      return (
        <mesh position={object.position} castShadow receiveShadow>
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          <meshStandardMaterial color={object.color} />
        </mesh>
      );
  }
}

function SceneViewport() {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={['#f4efe7']} />
      <ambientLight intensity={1.4} />
      <directionalLight
        castShadow
        intensity={1.8}
        position={[6, 8, 4]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <Grid
        args={[30, 30]}
        cellColor="#d6d3d1"
        sectionColor="#a8a29e"
        fadeDistance={45}
        fadeStrength={1.2}
        position={[0, 0.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
      {objects.map((object) => (
        <PrimitivePreview key={object.id} object={object} />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <div className="grid min-h-screen grid-cols-1 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.22),_transparent_32%),linear-gradient(135deg,_#1c1917_0%,_#0c0a09_72%)] lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="border-b border-stone-800/80 bg-stone-950/70 p-6 backdrop-blur lg:border-b-0 lg:border-r">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-orange-300/80">
                Scene
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-stone-50">
                Collab3D MVP
              </h1>
              <p className="mt-2 text-sm text-stone-400">
                Frontend scaffold for the collaborative low-poly scene editor.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                Add Primitive
              </p>
              <div className="grid gap-3">
                {(['Cube', 'Sphere', 'Cylinder'] as PrimitiveType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="rounded-2xl border border-stone-800 bg-stone-900/80 px-4 py-3 text-left text-sm font-medium text-stone-100 transition hover:border-orange-400/60 hover:bg-stone-900"
                  >
                    Add {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                Online Users
              </p>
              <div className="space-y-3">
                {['Guest-142', 'Guest-318', 'Guest-502'].map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3"
                  >
                    <span className="text-sm text-stone-200">{user}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-[55vh] border-b border-stone-800/80 bg-stone-900/50 p-4 lg:min-h-screen lg:border-b-0">
          <div className="h-full min-h-[55vh] overflow-hidden rounded-[28px] border border-stone-800 bg-stone-200 shadow-2xl shadow-black/30 lg:min-h-[calc(100vh-2rem)]">
            <SceneViewport />
          </div>
        </main>

        <aside className="bg-stone-950/70 p-6 backdrop-blur lg:border-l lg:border-stone-800/80">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-sky-300/80">
                Selection
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                Starter Cube
              </h2>
              <p className="mt-2 text-sm text-stone-400">
                The right sidebar is ready for the upcoming object property editor.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { label: 'Position', value: 'X -2.00 / Y 0.50 / Z 0.00' },
                { label: 'Rotation', value: 'X 0.00 / Y 0.00 / Z 0.00' },
                { label: 'Scale', value: 'X 1.00 / Y 1.00 / Z 1.00' },
                { label: 'Color', value: '#f97316' },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-100">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
            >
              Delete Object
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
