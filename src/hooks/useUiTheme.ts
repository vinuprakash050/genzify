import { getActiveScenePreset, getActiveUiTheme } from "../config/theme";

export function useUiTheme() {
  return getActiveUiTheme();
}

export function useScenePreset() {
  return getActiveScenePreset();
}
