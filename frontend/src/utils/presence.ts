export function getUserColor(name: string) {
  const palette = ['#fb923c', '#38bdf8', '#a78bfa', '#34d399', '#f472b6', '#f59e0b'];
  const hash = Array.from(name).reduce((total, character) => total + character.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export function getUserInitial(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || '?';
}
