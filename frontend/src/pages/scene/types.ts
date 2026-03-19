type PrimitiveType = 'Cube' | 'Sphere' | 'Cylinder';

export type SceneObject = {
  id: string;
  type: PrimitiveType;
  name: string;
  position: [number, number, number];
  color: string;
  locked?: boolean;
  visible?: boolean;
};