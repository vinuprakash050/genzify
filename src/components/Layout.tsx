'use client';

import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import LoginModal from "./LoginModal";
import { useUiTheme } from "../hooks/useUiTheme";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const uiTheme = useUiTheme();

  const spacingMap: Record<string, string> = {
    "transparent-float": "pt-28 sm:pt-32",
    "tech-frame": "pt-24 sm:pt-28",
    "editorial-ribbon": "pt-32 sm:pt-36",
  };
  const spacingClass = spacingMap[uiTheme.headerStyle as string] ?? "pt-28 sm:pt-32";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />
      <main className={`relative z-10 flex-1 ${spacingClass}`}>{children}</main>
      <Footer />
      <CartDrawer />
      <LoginModal />
    </div>
  );
}
