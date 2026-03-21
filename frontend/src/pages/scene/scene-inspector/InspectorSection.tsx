import type { ReactNode } from 'react';

interface InspectorSectionProps {
  title: string;
  children: ReactNode;
}

function InspectorSection({ title, children }: InspectorSectionProps) {
  return (
    <section className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-soft)]">
      <h2 className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-secondary)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default InspectorSection;
