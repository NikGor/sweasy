import Icon from "./Icon";
import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative flex items-center h-9 w-[72px] rounded-xl border-2 border-primary dark:border-white bg-surface dark:bg-[#0a0f1e] transition-colors duration-300 overflow-hidden"
    >
      {/* Icons */}
      <span
        className={`flex-1 flex items-center justify-center z-10 transition-colors duration-300 ${
          isDark ? "text-white/40" : "text-primary"
        }`}
      >
        <Icon name="light_mode" filled={!isDark} className="text-[18px]" />
      </span>
      <span
        className={`flex-1 flex items-center justify-center z-10 transition-colors duration-300 ${
          isDark ? "text-[#0a0f1e]" : "text-primary/30"
        }`}
      >
        <Icon name="dark_mode" filled={isDark} className="text-[18px]" />
      </span>

      {/* Sliding pill */}
      <span
        className={`absolute top-1/2 -translate-y-1/2 h-[calc(100%-6px)] w-[30px] rounded-[8px] bg-[#FF2D55] dark:bg-[#00FF9D] shadow-[2px_2px_0_0_rgba(0,0,0,0.3)] transition-transform duration-300 ease-out ${
          isDark ? "translate-x-[34px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
