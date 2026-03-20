type DashboardIconProps = {
  className?: string;
};

type AppLogoProps = {
  className?: string;
};

export function AppLogo({ className = 'h-11 w-11' }: AppLogoProps = {}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] backdrop-blur ${className}`}
    >
      <div className="relative h-5 w-5 rotate-12">
        <div className="absolute inset-x-0 top-0 h-2/3 rounded-sm border border-[color:var(--border-strong)] bg-[var(--surface-muted)]" />
        <div className="absolute bottom-0 left-0 h-2/3 w-2/3 rounded-sm border border-[color:var(--border-subtle)] bg-[var(--surface-soft)]" />
        <div className="absolute bottom-0 right-0 h-2/3 w-2/3 rounded-sm border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)]" />
      </div>
    </div>
  );
}

export function SearchIcon({
  className = 'h-4 w-4 text-[color:var(--text-muted)]',
}: DashboardIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 21L16.65 16.65M10.75 18.5C15.03 18.5 18.5 15.03 18.5 10.75C18.5 6.47 15.03 3 10.75 3C6.47 3 3 6.47 3 10.75C3 15.03 6.47 18.5 10.75 18.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusIcon({ className = 'h-4 w-4' }: DashboardIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className = 'h-4 w-4' }: DashboardIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DeleteIcon({ className = 'h-4 w-4' }: DashboardIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7H20M9.5 3H14.5M9 11V17M15 11V17M7 7L7.8 19C7.86 19.9 8.6 20.6 9.5 20.6H14.5C15.4 20.6 16.14 19.9 16.2 19L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
