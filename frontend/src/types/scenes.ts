//UI TYPES
export type SceneAccent = 'blue' | 'stone' | 'green';

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