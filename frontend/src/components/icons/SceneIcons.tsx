type DualToneIconProps = {
  className?: string;
  primaryStroke?: string;
  secondaryStroke?: string;
  primaryStrokeWidth?: number;
  secondaryStrokeWidth?: number;
};

type SingleToneIconProps = {
  className?: string;
  stroke?: string;
  strokeWidth?: number;
};

export function MarkIcon({
  className = 'h-4.5 w-4.5',
  stroke = 'currentColor',
  strokeWidth = 1.5,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3ZM12 3V21M4 7.5L12 12L20 7.5"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CubeIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3.5L19 7.5V16.5L12 20.5L5 16.5V7.5L12 3.5Z"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3.5V20.5M5 7.5L12 11.5L19 7.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SphereIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
      />
      <path
        d="M3.8 12H20.2M12 3.5C14.2 5.8 15.4 8.8 15.4 12C15.4 15.2 14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.6 8.8 8.6 12C8.6 15.2 9.8 18.2 12 20.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CylinderIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="5.5"
        rx="5.5"
        ry="2.5"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
      />
      <path
        d="M6.5 5.5V17.5C6.5 18.9 8.96 20 12 20C15.04 20 17.5 18.9 17.5 17.5V5.5"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M6.5 17.5C6.5 18.9 8.96 20 12 20C15.04 20 17.5 18.9 17.5 17.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ConeIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5L5.5 17.5M12 4.5L18.5 17.5"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 17.5C6.7 19 9 20 12 20C15 20 17.3 19 18.5 17.5M5.5 17.5C6.9 16.4 9.2 15.8 12 15.8C14.8 15.8 17.1 16.4 18.5 17.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PyramidIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4.5L5 16.5L12 20L19 16.5L12 4.5Z"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.5V20M5 16.5L12 12L19 16.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlaneIcon({
  className = 'h-4.5 w-4.5',
  primaryStroke = 'currentColor',
  secondaryStroke = 'currentColor',
  primaryStrokeWidth = 1.5,
  secondaryStrokeWidth = 1.5,
}: DualToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.3 6.9L15.3 3.2L16.5 13.9L7.5 17.6L6.3 6.9Z"
        stroke={primaryStroke}
        strokeWidth={primaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 17.6L15.5 14.2M10.7 5.1L11.9 15.8M6.9 12.2L15.9 8.5"
        stroke={secondaryStroke}
        strokeWidth={secondaryStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeftIcon({
  className = 'h-4 w-4',
  stroke = 'currentColor',
  strokeWidth = 1.8,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18L9 12L15 6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({
  className = 'h-4 w-4',
  stroke = 'currentColor',
  strokeWidth = 1.8,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18L15 12L9 6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeIcon({
  className = 'h-3 w-3',
  stroke = 'currentColor',
  strokeWidth = 1.7,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12C4.67 7.33 8 5 12 5C16 5 19.33 7.33 22 12C19.33 16.67 16 19 12 19C8 19 4.67 16.67 2 12ZM12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LockIcon({
  className = 'h-3 w-3',
  stroke = 'currentColor',
  strokeWidth = 1.7,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 11V8C7 5.24 9.24 3 12 3C14.76 3 17 5.24 17 8V11M6 11H18V20H6V11Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HelpCircleIcon({
  className = 'h-4 w-4',
  stroke = 'currentColor',
  strokeWidth = 1.8,
}: SingleToneIconProps = {}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M9.75 9.3C9.75 8.06 10.88 7.1 12.26 7.1C13.65 7.1 14.75 7.94 14.75 9.16C14.75 10.17 14.22 10.72 13.16 11.35C12.14 11.95 11.75 12.42 11.75 13.4V13.75M12 17.25H12.01"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export const primitiveIcons = {
  cube: (
    <CubeIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  sphere: (
    <SphereIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  cylinder: (
    <CylinderIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  cone: (
    <ConeIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  pyramid: (
    <PyramidIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
  plane: (
    <PlaneIcon
      className="h-6 w-6"
      primaryStroke="var(--text-primary)"
      secondaryStroke="var(--text-secondary)"
      primaryStrokeWidth={1.25}
      secondaryStrokeWidth={1}
    />
  ),
} as const;
