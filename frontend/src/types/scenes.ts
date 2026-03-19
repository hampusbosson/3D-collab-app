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
