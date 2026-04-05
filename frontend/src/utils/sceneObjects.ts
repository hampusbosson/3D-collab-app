import type { PrimitiveType } from '../types/scene';
import type { CreateSceneObjectDto, SceneObjectDto, UpdateSceneObjectDto } from '../types/scenes';

export function createUpdatePayload(object: SceneObjectDto): UpdateSceneObjectDto {
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

export function createSceneObject(
  sceneId: string,
  type: PrimitiveType,
  index: number,
  createdBy: string,
): SceneObjectDto {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    sceneId,
    type,
    name: `${type} ${index + 1}`,
    positionX: 0,
    positionY: 0.7,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    color: '#fb923c',
    opacity: 1,
    createdBy,
    updatedAt: now,
  };
}

export function createSceneObjectPayload(object: SceneObjectDto): CreateSceneObjectDto {
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

export function upsertSceneObject(
  objects: SceneObjectDto[],
  nextObject: SceneObjectDto,
) {
  const existingIndex = objects.findIndex((object) => object.id === nextObject.id);

  if (existingIndex === -1) {
    return [...objects, nextObject];
  }

  return objects.map((object) => (object.id === nextObject.id ? nextObject : object));
}

export function areSceneObjectsEqual(left: SceneObjectDto, right: SceneObjectDto) {
  return (
    left.id === right.id &&
    left.sceneId === right.sceneId &&
    left.type === right.type &&
    left.name === right.name &&
    left.positionX === right.positionX &&
    left.positionY === right.positionY &&
    left.positionZ === right.positionZ &&
    left.rotationX === right.rotationX &&
    left.rotationY === right.rotationY &&
    left.rotationZ === right.rotationZ &&
    left.scaleX === right.scaleX &&
    left.scaleY === right.scaleY &&
    left.scaleZ === right.scaleZ &&
    left.color === right.color &&
    left.opacity === right.opacity &&
    left.createdBy === right.createdBy
  );
}
