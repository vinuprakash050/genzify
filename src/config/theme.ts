export const colorTheme = {
  primary: "#7C3AED",
  secondary: "#00F5FF",
};

export const scenePresets = {
  particleOrbit: {
    id: "particleOrbit",
    name: "Particle Orbit",
    family: "ethereal",
  },
  wireSwarm: {
    id: "wireSwarm",
    name: "Wire Swarm",
    family: "cyberpunk",
  },
  monolithField: {
    id: "monolithField",
    name: "Monolith Field",
    family: "editorial",
  },
  punkSkull: {
    id: "punkSkull",
    name: "Punk Skull",
    family: "punk",
  },
  cyberHalo: {
    id: "cyberHalo",
    name: "Cyber Halo",
    family: "cyberpunk",
  },
  shardBurst: {
    id: "shardBurst",
    name: "Shard Burst",
    family: "aggressive",
  },
  chromeSpine: {
    id: "chromeSpine",
    name: "Chrome Spine",
    family: "industrial",
  },
  neonPortal: {
    id: "neonPortal",
    name: "Neon Portal",
    family: "futuristic",
  },
  glitchTotem: {
    id: "glitchTotem",
    name: "Glitch Totem",
    family: "street-tech",
  },
  skeletonRig: {
    id: "skeletonRig",
    name: "Skeleton Rig",
    family: "crazy-punk",
  },
};

export const uiThemes = {
  auroraStreet: {
    id: "auroraStreet",
    name: "Aurora Street",
    headerStyle: "transparent-float",
    heroStyle: "split-glass",
    defaultScene: "punkSkull",
    cardStyle: "glass-lift",
    gridStyle: "standard",
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    pageBackground: [
      "radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 36%)",
      "radial-gradient(circle at top right, color-mix(in srgb, var(--color-secondary) 20%, transparent), transparent 32%)",
      "linear-gradient(180deg, var(--color-bg-soft), var(--color-bg))",
    ].join(", "),
    panelBackground:
      "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, rgba(255, 255, 255, 0.06) 90%), color-mix(in srgb, var(--color-secondary) 8%, rgba(255, 255, 255, 0.03) 92%))",
    panelBorder:
      "color-mix(in srgb, var(--color-secondary) 24%, rgba(255, 255, 255, 0.12) 76%)",
    panelBlur: "18px",
    panelShadow:
      "0 18px 80px rgba(0, 0, 0, 0.35), 0 0 28px color-mix(in srgb, var(--color-primary) 10%, transparent)",
    buttonBackground:
      "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 84%, rgba(255, 255, 255, 0.12) 16%), color-mix(in srgb, var(--color-secondary) 80%, rgba(255, 255, 255, 0.2) 20%))",
    buttonText: "rgba(0, 0, 0, 0.92)",
  },
  carbonWire: {
    id: "carbonWire",
    name: "Carbon Wire",
    headerStyle: "tech-frame",
    heroStyle: "magazine-grid",
    defaultScene: "wireSwarm",
    cardStyle: "tech-tilt",
    gridStyle: "dense",
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    pageBackground: [
      "linear-gradient(135deg, rgba(2, 3, 8, 0.96), rgba(4, 6, 12, 0.84))",
      "repeating-linear-gradient(90deg, transparent 0, transparent 78px, color-mix(in srgb, var(--color-secondary) 10%, transparent) 79px, transparent 80px)",
      "radial-gradient(circle at 80% 10%, color-mix(in srgb, var(--color-secondary) 16%, transparent), transparent 28%)",
    ].join(", "),
    panelBackground:
      "linear-gradient(180deg, rgba(9, 12, 20, 0.92), rgba(6, 9, 15, 0.82))",
    panelBorder:
      "color-mix(in srgb, var(--color-secondary) 34%, rgba(255, 255, 255, 0.08) 66%)",
    panelBlur: "14px",
    panelShadow:
      "0 22px 70px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    buttonBackground:
      "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 92%, black 8%), color-mix(in srgb, var(--color-secondary) 66%, black 34%))",
    buttonText: "rgba(255, 255, 255, 0.96)",
  },
  monolithEdge: {
    id: "monolithEdge",
    name: "Monolith Edge",
    headerStyle: "editorial-ribbon",
    heroStyle: "editorial-stack",
    defaultScene: "monolithField",
    cardStyle: "monolith-stack",
    gridStyle: "offset",
    fontFamily: '"Space Grotesk", "Segoe UI", sans-serif',
    pageBackground: [
      "radial-gradient(circle at center, rgba(255, 255, 255, 0.03), transparent 22%)",
      "linear-gradient(160deg, rgba(5, 5, 8, 0.98), rgba(8, 10, 14, 0.95) 52%, rgba(4, 16, 18, 0.96))",
    ].join(", "),
    panelBackground:
      "linear-gradient(160deg, rgba(12, 12, 16, 0.9), rgba(18, 22, 30, 0.72))",
    panelBorder:
      "color-mix(in srgb, var(--color-primary) 28%, rgba(255, 255, 255, 0.08) 72%)",
    panelBlur: "24px",
    panelShadow:
      "0 28px 90px rgba(0, 0, 0, 0.55), 0 0 42px color-mix(in srgb, var(--color-secondary) 8%, transparent)",
    buttonBackground:
      "linear-gradient(135deg, color-mix(in srgb, var(--color-secondary) 88%, white 12%), color-mix(in srgb, var(--color-primary) 72%, white 28%))",
    buttonText: "rgba(0, 0, 0, 0.96)",
  },
};

export const theme = {
  colors: colorTheme,
  // Available UI presets: auroraStreet, carbonWire, monolithEdge
  ui: "monolithEdge",
  // Use "theme-default" or pick one:
  // particleOrbit, wireSwarm, monolithField, punkSkull, cyberHalo,
  // shardBurst, chromeSpine, neonPortal, glitchTotem, skeletonRig
  scene: "particleOrbit",
};

const storageKey = "genzify-theme";

function hexToRgbChannels(hex: string) {
  const value = hex.replace("#", "");
  const normalized = value.length === 3
    ? value
        .split("")
        .map((character) => character + character)
        .join("")
    : value;

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

function getResolvedTheme(nextTheme: any) {
  const colors = nextTheme?.colors ?? nextTheme ?? colorTheme;
  const ui = nextTheme?.ui ?? theme.ui;
  const scene = nextTheme?.scene ?? theme.scene;

  return { colors, ui, scene };
}

function applyUiTheme(uiThemeName: string, sceneName: string) {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  const selectedUiTheme = uiThemes[uiThemeName as keyof typeof uiThemes] ?? uiThemes[theme.ui as keyof typeof uiThemes];
  const selectedScene = sceneName === "theme-default"
    ? selectedUiTheme.defaultScene
    : scenePresets[sceneName as keyof typeof scenePresets]
      ? sceneName
      : selectedUiTheme.defaultScene;

  root.dataset.uiTheme = selectedUiTheme.id;
  root.dataset.scenePreset = selectedScene;
  root.style.setProperty("--font-family-display", selectedUiTheme.fontFamily);
  root.style.setProperty("--theme-page-background", selectedUiTheme.pageBackground);
  root.style.setProperty("--theme-panel-background", selectedUiTheme.panelBackground);
  root.style.setProperty("--theme-panel-border", selectedUiTheme.panelBorder);
  root.style.setProperty("--theme-panel-blur", selectedUiTheme.panelBlur);
  root.style.setProperty("--theme-panel-shadow", selectedUiTheme.panelShadow);
  root.style.setProperty("--theme-button-background", selectedUiTheme.buttonBackground);
  root.style.setProperty("--theme-button-text", selectedUiTheme.buttonText);
}

export function applyTheme(nextTheme = theme) {
  if (typeof window === "undefined") return;
  
  const storedTheme = window.localStorage.getItem(storageKey);
  const parsedStoredTheme = storedTheme ? JSON.parse(storedTheme) : null;
  const resolvedTheme = getResolvedTheme(parsedStoredTheme ?? nextTheme);
  const root = document.documentElement;

  // --color-primary / --color-secondary: hex values used directly in color-mix() throughout CSS
  root.style.setProperty("--color-primary", resolvedTheme.colors.primary);
  root.style.setProperty("--color-secondary", resolvedTheme.colors.secondary);
  // --color-primary-rgb / --color-secondary-rgb: space-separated channels for rgb(... / alpha) utilities
  root.style.setProperty("--color-primary-rgb", hexToRgbChannels(resolvedTheme.colors.primary));
  root.style.setProperty("--color-secondary-rgb", hexToRgbChannels(resolvedTheme.colors.secondary));
  applyUiTheme(resolvedTheme.ui, resolvedTheme.scene);
}

export function saveTheme(nextTheme: any) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(nextTheme));
  applyTheme(nextTheme);
}

export function getActiveUiTheme() {
  return uiThemes[theme.ui as keyof typeof uiThemes] ?? uiThemes.auroraStreet;
}

export function getActiveScenePreset() {
  const activeUiTheme = getActiveUiTheme();
  const requestedScene = theme.scene;
  const resolvedSceneId = requestedScene === "theme-default"
    ? activeUiTheme.defaultScene
    : scenePresets[requestedScene as keyof typeof scenePresets]
      ? requestedScene
      : activeUiTheme.defaultScene;

  return scenePresets[resolvedSceneId as keyof typeof scenePresets];
}
