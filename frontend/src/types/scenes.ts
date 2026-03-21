import type { PrimitiveType } from "./scene";

//UI TYPES
export type SceneAccent = "blue" | "stone" | "green";

export type ScenePreview = {
  primary: string;
  secondary: string;
  glow: string;
};

export type SceneSummary = {
  id: string;
  name: string;
  updatedAtLabel: string;
  collaborators: number;
  accent: SceneAccent;
  preview: ScenePreview;
};

// API / DATA TYPES
export type SceneDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateSceneDto = {
  name: string;
};

export type UpdateSceneDto = {
  name: string;
}

export type SceneObjectDto = {
  id: string;
  sceneId: string;
  type: PrimitiveType;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  color: string;
  opacity: number;
  createdBy: string;
  updatedAt: string;
};

export type CreateSceneObjectDto = {
  type: string;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  color: string;
  opacity: number;
};

export type SceneDetailsDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  objects: SceneObjectDto[];
};

export type UpdateSceneObjectDto = {
  type: string;
  name: string;
  positionX: number;
  positionY: number;
  positionZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  color: string;
  opacity: number;
};
