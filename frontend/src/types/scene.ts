// UI TYPES
export type PrimitiveType = 'Cube' | 'Sphere' | 'Cylinder' | 'Cone' | 'Pyramid' | 'Plane';

export type Vector3Tuple = [number, number, number];

export type VectorField = 'position' | 'rotation' | 'scale';

export type SceneObject = {
  id: string;
  type: PrimitiveType;
  name: string;
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
  color: string;
  opacity: number;
  locked?: boolean;
  visible?: boolean;
};

