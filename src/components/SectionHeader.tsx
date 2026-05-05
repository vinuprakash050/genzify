'use client';

import { useUiTheme } from "../hooks/useUiTheme";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  const uiTheme = useUiTheme();

  const titleClass = {
    "split-glass": "mt-3 text-3xl font-black uppercase text-white sm:text-5xl",
    "magazine-grid": "mt-3 text-3xl font-black uppercase text-white sm:text-5xl md:max-w-3xl",
    "editorial-stack": "mt-3 text-4xl font-black uppercase text-white sm:text-6xl",
  }[uiTheme.heroStyle as string] ?? "mt-3 text-3xl font-black uppercase text-white sm:text-5xl";

  return (
    <div className="max-w-2xl">
      <p className="text-sm uppercase tracking-[0.4em] text-secondary">{eyebrow}</p>
      <h2 className={titleClass}>{title}</h2>
      <p className="mt-4 text-base leading-7 muted-copy">{description}</p>
    </div>
  );
}
