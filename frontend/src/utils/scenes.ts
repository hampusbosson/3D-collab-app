export type SceneSummary = {
  id: string;
  name: string;
  updatedAtLabel: string;
  collaborators: number;
  accent: 'blue' | 'stone' | 'green';
  preview: {
    primary: string;
    secondary: string;
    glow: string;
  };
};

export const scenes: SceneSummary[] = [
  {
    id: 'loft-study',
    name: 'Loft Study',
    updatedAtLabel: 'Updated 6 minutes ago',
    collaborators: 3,
    accent: 'blue',
    preview: {
      primary: '#dbeafe',
      secondary: '#7dd3fc',
      glow: 'rgba(56, 189, 248, 0.34)',
    },
  },
  {
    id: 'gallery-blockout',
    name: 'Gallery Blockout',
    updatedAtLabel: 'Updated yesterday',
    collaborators: 5,
    accent: 'stone',
    preview: {
      primary: '#e7e5e4',
      secondary: '#cbd5e1',
      glow: 'rgba(148, 163, 184, 0.28)',
    },
  },
  {
    id: 'courtyard-v2',
    name: 'Courtyard V2',
    updatedAtLabel: 'Updated 3 days ago',
    collaborators: 2,
    accent: 'green',
    preview: {
      primary: '#d1fae5',
      secondary: '#5eead4',
      glow: 'rgba(16, 185, 129, 0.25)',
    },
  },
];
