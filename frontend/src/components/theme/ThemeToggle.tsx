import { useTheme } from './ThemeProvider';

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3V5.5M12 18.5V21M5.64 5.64L7.41 7.41M16.59 16.59L18.36 18.36M3 12H5.5M18.5 12H21M5.64 18.36L7.41 16.59M16.59 7.41L18.36 5.64M16 12C16 14.21 14.21 16 12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 15.5C19.06 15.81 18.05 15.98 17 15.98C11.48 15.98 7 11.5 7 5.98C7 4.93 7.17 3.92 7.48 3C4.25 4.1 2 7.17 2 10.75C2 15.29 5.71 19 10.25 19C13.83 19 16.9 16.75 18 13.52C18.62 14.23 19.27 14.91 20 15.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] px-4 py-3 text-sm font-medium text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:border-[color:var(--border-strong)]"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}

export default ThemeToggle;
