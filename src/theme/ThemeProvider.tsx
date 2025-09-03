import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

type Theme = "light" | "dark";
type ThemeCtx = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches)
      return "dark";
  } catch {}
  return "light";
}

function applyClass(theme: Theme) {
  const root = document.documentElement;
  // toggle 'dark' only on <html>
  root.classList.toggle("dark", theme === "dark");
  // just in case: ensure <body> doesn't carry stale 'dark'
  document.body.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    applyClass(theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const ctx = useMemo<ThemeCtx>(
    () => ({
      theme,
      toggleTheme: () =>
        setThemeState((t) => (t === "dark" ? "light" : "dark")),
      setTheme: (t) => setThemeState(t),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={ctx}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
