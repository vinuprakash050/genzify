'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { useUiTheme } from "../hooks/useUiTheme";
import HeroScene from "./HeroSceneSimple";

export default function HeroSection() {
  const uiTheme = useUiTheme();

  if (uiTheme.heroStyle === "magazine-grid") {
    return (
      <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-4 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px),linear-gradient(180deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:72px_72px]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs uppercase tracking-[0.7em] text-secondary"
            >
              System Drop 01
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl text-5xl font-black uppercase leading-[0.9] text-white sm:text-7xl xl:text-[8rem]"
            >
              OVERSIZED ENERGY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl text-lg leading-8 muted-copy"
            >
              Built for comfort. Designed for presence.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="glass-button rounded-md px-7 py-4 text-sm font-black uppercase tracking-[0.28em]"
              >
                Shop Now
              </Link>
              <a
                href="#featured-drop"
                className="rounded-md border border-secondary/35 px-7 py-4 text-sm font-black uppercase tracking-[0.28em] text-secondary"
              >
                View Drop
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {[
              ["240 GSM", "Oversized tees cut with a weighted silhouette."],
              ["350 GSM", "Hoodies built with structure and deep volume."],
              ["240 GSM Terry", "Tanktops made for breathable layering."],
              ["Future Ready", "UI prepared for auth, orders, and shipping APIs."],
            ].map(([title, copy], index) => (
              <div
                key={title}
                className={`glass-panel p-5 ${index === 0 ? "sm:col-span-2" : ""} rounded-md`}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-primary">{title}</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-white">{copy}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  if (uiTheme.heroStyle === "editorial-stack") {
    return (
      <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-4 sm:px-6 lg:px-10">
        <HeroScene scenePreset={uiTheme.defaultScene} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(0,0,0,0.7)_100%)]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel max-w-sm rounded-[2.5rem] p-6"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-secondary">Brand Build</p>
            <div className="mt-6 space-y-4">
              {[
                ["Oversized T-Shirts", "240 GSM cotton"],
                ["Oversized Hoodies", "350 GSM heavyweight"],
                ["Oversized Tanktops", "240 GSM terry cotton"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm muted-copy">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:pt-16">
            <motion.p
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 text-sm uppercase tracking-[0.7em] text-primary"
            >
              Quiet Weight
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl text-5xl font-black uppercase leading-[0.92] text-white sm:text-7xl xl:text-[7.3rem]"
            >
              OVERSIZED ENERGY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-xl text-lg leading-8 muted-copy"
            >
              Built for comfort. Designed for presence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="glass-button rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.25em] transition hover:scale-[1.02]"
              >
                Shop Now
              </Link>
              <a
                href="#featured-drop"
                className="rounded-full border border-secondary/30 px-7 py-4 text-sm font-black uppercase tracking-[0.25em] text-secondary transition hover:shadow-glow"
              >
                View Drop
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] items-center overflow-hidden px-4 sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.55)_100%)]" /> 
      <div className="relative p-6">
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-sm uppercase tracking-[0.6em] text-secondary"
            >
              Future Uniform
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-4xl text-5xl font-black uppercase leading-[0.95] text-white sm:text-7xl xl:text-[7.5rem]"
            >
              OVERSIZED ENERGY
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-6 max-w-xl text-lg leading-8 muted-copy"
            >
              Built for comfort. Designed for presence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/products"
                className="glass-button rounded-full px-7 py-4 text-sm font-black uppercase tracking-[0.25em] transition hover:scale-[1.02]"
              >
                Shop Now
              </Link>
              <a
                href="#featured-drop"
                className="rounded-full border border-secondary/30 px-7 py-4 text-sm font-black uppercase tracking-[0.25em] text-secondary transition hover:shadow-glow"
              >
                View Drop
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="glass-panel ml-auto max-w-md rounded-[2.5rem] p-6"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Fabric Specs</p>
            <div className="mt-6 space-y-5">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm muted-copy">Oversized T-Shirts</p>
                <p className="mt-2 text-xl font-semibold">240 GSM cotton with a heavy oversized drape.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm muted-copy">Oversized Hoodies</p>
                <p className="mt-2 text-xl font-semibold">350 GSM build for structure, warmth, and weight.</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm muted-copy">Oversized Tanktops</p>
                <p className="mt-2 text-xl font-semibold">
                  240 GSM terry cotton made for breathable layering.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
