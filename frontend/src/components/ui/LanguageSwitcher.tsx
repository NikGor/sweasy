import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

const LANGUAGES = ["RU", "UA", "EN", "DE"] as const;
type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "sweasy-lang";

function getInitialLang(): Language {
  if (typeof window === "undefined") return "RU";
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && LANGUAGES.includes(stored) ? stored : "RU";
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState<Language>(getInitialLang);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        className="flex items-center gap-1 h-9 px-2.5 rounded-xl border-2 border-primary dark:border-white bg-surface dark:bg-[#0a0f1e] text-primary dark:text-white font-headline font-black text-sm uppercase tracking-tighter transition-colors duration-300 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-[#0a0f1e]"
      >
        {lang}
        <Icon
          name="expand_more"
          className={`text-[18px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] min-w-[64px] rounded-xl border-2 border-primary dark:border-white bg-surface dark:bg-[#0a0f1e] overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] z-50">
          {LANGUAGES.map((code) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 font-headline font-black text-sm uppercase tracking-tighter text-left transition-colors ${
                code === lang
                  ? "bg-[#FF2D55] dark:bg-[#00FF9D] text-white dark:text-[#0a0f1e]"
                  : "text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
