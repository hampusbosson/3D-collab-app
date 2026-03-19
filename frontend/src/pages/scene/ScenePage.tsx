import { Grid, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../../components/theme/ThemeProvider';
import ThemeToggle from '../../components/theme/ThemeToggle';
import { scenes } from '../../utils/scenes';

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
    color: '#fb923c',
  },
  {
    id: 'sphere-01',
    type: 'Sphere',
    name: 'Signal Sphere',
    position: [0, 0.75, 0],
    color: '#22d3ee',
  },
  {
    id: 'cylinder-01',
    type: 'Cylinder',
    name: 'Axis Cylinder',
    position: [2, 0.75, 0],
    color: '#38bdf8',
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

function SceneViewport({ isDark }: { isDark: boolean }) {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 5, 8], fov: 45 }}
      className="h-full w-full"
    >
      <color attach="background" args={[isDark ? '#0f172a' : '#dbe4ef']} />
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
        cellColor={isDark ? '#334155' : '#cbd5e1'}
        sectionColor={isDark ? '#64748b' : '#94a3b8'}
        fadeDistance={45}
        fadeStrength={1.2}
        position={[0, 0.01, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.2} />
      </mesh>
      {objects.map((object) => (
        <PrimitivePreview key={object.id} object={object} />
      ))}
      <OrbitControls makeDefault />
    </Canvas>
  );
}

function ScenePage() {
  const { sceneId } = useParams();
  const { theme } = useTheme();
  const scene = scenes.find((entry) => entry.id === sceneId) ?? scenes[0];
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[color:var(--text-primary)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        <aside className="border-b border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] p-6 backdrop-blur-xl lg:border-b-0 lg:border-r">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                Scene
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
                {scene.name}
              </h1>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{scene.updatedAtLabel}</p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium text-[color:var(--text-secondary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
            >
              Back to dashboard
            </Link>

            <ThemeToggle />

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Add Primitive
              </p>
              <div className="grid gap-3">
                {(['Cube', 'Sphere', 'Cylinder'] as PrimitiveType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-left text-sm font-medium text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)]"
                  >
                    Add {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Online Users
              </p>
              <div className="space-y-3">
                {['Guest-142', 'Guest-318', 'Guest-502'].map((user) => (
                  <div
                    key={user}
                    className="flex items-center justify-between rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 shadow-[var(--shadow-soft)]"
                  >
                    <span className="text-sm text-[color:var(--text-secondary)]">{user}</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="min-h-[56vh] p-4 lg:min-h-screen lg:p-6">
          <div className="h-full min-h-[56vh] overflow-hidden rounded-[32px] border border-[color:var(--border-subtle)] bg-[var(--surface-panel)] shadow-[var(--shadow-panel)] lg:min-h-[calc(100vh-3rem)]">
            <SceneViewport isDark={isDark} />
          </div>
        </main>

        <aside className="border-t border-[color:var(--border-subtle)] bg-[var(--surface-sidebar)] p-6 backdrop-blur-xl lg:border-l lg:border-t-0">
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                Selection
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">
                Starter Cube
              </h2>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                This panel is ready for live object property editing.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                { label: 'Position', value: 'X -2.00 / Y 0.50 / Z 0.00' },
                { label: 'Rotation', value: 'X 0.00 / Y 0.00 / Z 0.00' },
                { label: 'Scale', value: 'X 1.00 / Y 1.00 / Z 1.00' },
                { label: 'Color', value: '#fb923c' },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-4 shadow-[var(--shadow-soft)]"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[color:var(--text-primary)]">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full rounded-2xl border border-[color:var(--accent-danger-border)] bg-[var(--accent-danger-bg)] px-4 py-3 text-sm font-medium text-[color:var(--accent-danger-text)] transition hover:opacity-90"
            >
              Delete Object
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ScenePage;
