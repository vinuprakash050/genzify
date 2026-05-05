'use client';

import PageIntro from "@/components/PageIntro";
import SectionCard from "@/components/SectionCard";

export default function SizeGuidePage() {
  return (
    <PageIntro
      eyebrow="Sizing"
      title="Size guide"
      description="This page can later pull product-specific fit charts and measurement data."
    >
      <SectionCard className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-[0.25em] text-secondary">
              <th className="pb-4 pr-6">Size</th>
              <th className="pb-4 pr-6">Chest</th>
              <th className="pb-4 pr-6">Length</th>
              <th className="pb-4">Shoulder</th>
            </tr>
          </thead>
          <tbody className="text-white/85">
            {[
              ["S", '44"', '28"', '20"'],
              ["M", '47"', '29"', '21"'],
              ["L", '50"', '30"', '22"'],
              ["XL", '53"', '31"', '23"'],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-white/5">
                {row.map((cell) => (
                  <td key={cell} className="py-4 pr-6">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </PageIntro>
  );
}
