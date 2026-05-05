'use client';

import { useEffect } from "react";
import { AppProviders } from "@/context/AppProviders";
import { applyTheme } from "@/config/theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme({
      colors: {
        primary: "#7C3AED",
        secondary: "#00F5FF",
      },
      ui: "monolithEdge",
      scene: "particleOrbit",
    });
  }, []);

  return <AppProviders>{children}</AppProviders>;
}
