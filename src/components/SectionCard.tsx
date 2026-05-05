'use client';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

function SectionCard({ children, className = "" }: SectionCardProps) {
  return <div className={`glass-panel rounded-[2rem] p-6 ${className}`}>{children}</div>;
}

export default SectionCard;
