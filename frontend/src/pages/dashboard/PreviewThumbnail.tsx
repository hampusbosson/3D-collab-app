interface PreviewThumbnailProps {
  primary: string;
  secondary: string;
  glow: string;
}

function PreviewThumbnail({
  primary,
  secondary,
  glow,
}: PreviewThumbnailProps) {
  return (
    <div
      className="relative h-52 overflow-hidden rounded-[28px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--bg-canvas)_0%,rgba(148,163,184,0.12)_100%)]"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 24px 60px ${glow}`,
      }}
    >
      <div
        className="absolute left-1/2 top-10 h-20 w-36 -translate-x-1/2 rounded-[24px] blur-3xl"
        style={{ backgroundColor: secondary, opacity: 0.8 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(148,163,184,0.18)_100%)]" />
      <div
        className="absolute left-6 top-8 h-16 w-16 rounded-[22px] border border-[color:rgba(255,255,255,0.25)]"
        style={{ backgroundColor: primary }}
      />
      <div
        className="absolute right-10 top-12 h-24 w-24 rounded-[28px] border border-[color:rgba(255,255,255,0.25)]"
        style={{ backgroundColor: secondary }}
      />
      <div
        className="absolute bottom-11 left-1/2 h-12 w-44 -translate-x-1/2 rounded-[20px] border border-[color:rgba(148,163,184,0.22)] bg-[rgba(15,23,42,0.55)] shadow-[0_20px_35px_rgba(15,23,42,0.18)] backdrop-blur"
        style={{ transform: 'translateX(-50%) perspective(220px) rotateX(65deg)' }}
      />
      <div
        className="absolute bottom-16 left-1/2 h-16 w-40 -translate-x-1/2 rounded-[22px] border border-[color:rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.7)] shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
        style={{ transform: 'translateX(-50%) perspective(180px) rotateX(18deg)' }}
      />
    </div>
  );
}

export default PreviewThumbnail;
