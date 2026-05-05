'use client';

import Link from "next/link";
import PageTransition from "./PageTransition";
import SectionCard from "./SectionCard";

interface AuthFormShellProps {
  eyebrow: string;
  title: string;
  description: string;
  form: React.ReactNode;
  footerText?: string;
  footerLinkLabel?: string;
  footerLinkTo?: string;
}

function AuthFormShell({
  eyebrow,
  title,
  description,
  form,
  footerText,
  footerLinkLabel,
  footerLinkTo,
}: AuthFormShellProps) {
  return (
    <PageTransition className="px-4 pb-20 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <SectionCard className="max-w-md">
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black uppercase text-white">{title}</h1>
          <p className="mt-4 leading-8 muted-copy">{description}</p>
          {footerText && footerLinkTo ? (
            <p className="mt-8 text-sm muted-copy">
              {footerText}{" "}
              <Link href={footerLinkTo} className="text-primary">
                {footerLinkLabel}
              </Link>
            </p>
          ) : null}
        </SectionCard>
        <SectionCard>{form}</SectionCard>
      </div>
    </PageTransition>
  );
}

export default AuthFormShell;
