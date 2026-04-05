import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";

export default function NotFound() {
  useSEO({
    title: "404 — страница не найдена — Sweasy",
    description: "Страница не найдена. Возможно, она спряталась за облаками.",
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-surface dark:bg-[#0a0f1e] flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="text-center max-w-xl">
        <div className="font-headline font-black text-[120px] sm:text-[200px] md:text-[280px] leading-none tracking-tighter bg-gradient-to-br from-[#FF2D55] to-[#6A001A] dark:from-[#00FF9D] dark:to-[#229ED9] bg-clip-text text-transparent">
          404
        </div>
        <h1 className="font-headline font-black text-2xl sm:text-4xl md:text-5xl text-primary dark:text-white tracking-tighter uppercase mb-4 sm:mb-6">
          Заблудились в Альпах
        </h1>
        <p className="text-on-surface-variant dark:text-white/60 text-sm sm:text-base leading-relaxed mb-8 sm:mb-12 max-w-md mx-auto">
          Такой страницы у нас нет. Возможно, она спряталась за облаками, или вы шли по неверному маршруту.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#FF2D55] hover:bg-[#ff4d70] text-white font-headline font-black text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl uppercase tracking-tighter transition-all shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          Вернуться домой
        </Link>
      </div>
    </div>
  );
}
