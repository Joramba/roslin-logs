import { useTheme } from "@/app/theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="
        inline-flex items-center gap-2 rounded-xl border px-3 py-2
        bg-white shadow-sm hover:bg-gray-50 transition
        dark:bg-zinc-900 dark:border-zinc-700 dark:hover:bg-zinc-800
      "
      onClick={toggleTheme}
      title={isDark ? "Light theme" : "Dark theme"}
    >
      <span aria-hidden="true" className="text-lg leading-none">
        {isDark ? "🌞" : "🌙"}
      </span>
      <span className="text-sm">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
