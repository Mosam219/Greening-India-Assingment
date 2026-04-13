export type AppTheme = "light" | "dark";

const themeStorageKey = "taskflow.theme";

function isAppTheme(value: string | null): value is AppTheme {
  return value === "light" || value === "dark";
}

export function getStoredTheme() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  return isAppTheme(storedTheme) ? storedTheme : null;
}

export function getPreferredTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveInitialTheme() {
  return getStoredTheme() ?? getPreferredTheme();
}

export function persistTheme(theme: AppTheme) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(themeStorageKey, theme);
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function initializeTheme() {
  const theme = resolveInitialTheme();
  applyTheme(theme);
  return theme;
}

export function getThemeStorageKey() {
  return themeStorageKey;
}
