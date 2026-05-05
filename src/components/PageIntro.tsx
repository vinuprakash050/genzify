'use client';

import PageTransition from "./PageTransition";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function PageIntro({ eyebrow, title, description, children, className = "" }: PageIntroProps) {
  return (
    <PageTransition className={`px-4 pb-20 pt-14 sm:px-6 sm:pt-16 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white sm:text-6xl">{title}</h1>
          {description ? <p className="mt-4 text-base leading-8 muted-copy">{description}</p> : null}
        </div>
        {children}
      </div>
    </PageTransition>
  );
}

export default PageIntro;
