'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import CartDrawer from "./CartDrawer";
import LoginModal from "./LoginModal";
import { useUiTheme } from "../hooks/useUiTheme";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import ClientOnly from "./ClientOnly";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const uiTheme = useUiTheme();

  // Admin pages get no Navbar, Footer, or cart/login overlays
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  const spacingMap: Record<string, string> = {
    "transparent-float": "pt-28 sm:pt-32",
    "tech-frame": "pt-24 sm:pt-28",
    "editorial-ribbon": "pt-32 sm:pt-36",
  };
  const spacingClass = spacingMap[uiTheme.headerStyle as string] ?? "pt-28 sm:pt-32";

  return (
    <div className="relative flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className={`relative z-10 flex-1 ${spacingClass}`}>{children}</main>
      <Footer />
      <ClientOnly>
        <CartDrawer />
        <LoginModal />
      </ClientOnly>
    </div>
  );
}
