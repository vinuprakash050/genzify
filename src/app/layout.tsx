import type { Metadata } from "next";
import ThemeProvider from "./theme-provider";
import Layout from "@/components/Layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genzify - Streetwear Store",
  description: "Modern streetwear e-commerce for Gen Z",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Layout>{children}</Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
