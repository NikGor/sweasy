import { Link } from "react-router-dom";
import { useEffect } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";

interface Props {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}

export default function LegalLayout({ title, updatedAt = "2026-04-05", children }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} — Sweasy`;
  }, [title]);

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0f1e] flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4">
        <Link
          to="/"
          className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tighter uppercase font-headline"
        >
          Sweasy
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Content */}
      <main className="grow pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-on-surface-variant dark:text-white/60 hover:text-primary dark:hover:text-white font-headline font-black text-xs sm:text-sm uppercase tracking-widest mb-6 sm:mb-8 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            На главную
          </Link>

          <h1 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-primary dark:text-white tracking-tighter uppercase leading-none mb-2 sm:mb-4">
            {title}
          </h1>
          <p className="text-on-surface-variant dark:text-white/50 font-bold text-xs sm:text-sm uppercase tracking-widest mb-8 sm:mb-12">
            Обновлено: {updatedAt}
          </p>

          <div className="prose-custom text-on-surface dark:text-white/80 text-sm sm:text-base leading-relaxed space-y-5 sm:space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
