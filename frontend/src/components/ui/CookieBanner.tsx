import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateConsent, trackEvent } from "../../lib/analytics";

const STORAGE_KEY = "sweasy-cookie-consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (choice: "accept" | "reject") => {
    localStorage.setItem(STORAGE_KEY, choice);
    updateConsent(choice === "accept");
    trackEvent("cookie_consent", { choice });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-3 sm:px-6 pb-3 sm:pb-6 pointer-events-none animate-[slideUp_.4s_ease-out]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#0a0f1e] border-2 border-primary dark:border-white rounded-2xl shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] p-4 sm:p-6 pointer-events-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 md:gap-6">
          <div className="flex-1">
            <h3 className="font-headline font-black text-base sm:text-lg text-primary dark:text-white uppercase tracking-tighter mb-1">
              Мы используем cookies
            </h3>
            <p className="text-on-surface-variant dark:text-white/60 text-xs sm:text-sm leading-relaxed">
              Мы используем cookies для корректной работы сайта и аналитики. Подробнее в{" "}
              <Link to="/cookies" className="text-[#FF2D55] dark:text-[#00FF9D] hover:underline font-bold">
                Политике cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => decide("reject")}
              className="flex-1 md:flex-none bg-transparent text-primary dark:text-white border-2 border-primary dark:border-white font-headline font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-[#0a0f1e] uppercase tracking-tighter transition-colors"
            >
              Отклонить
            </button>
            <button
              onClick={() => decide("accept")}
              className="flex-1 md:flex-none bg-[#FF2D55] hover:bg-[#ff4d70] text-white font-headline font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl uppercase tracking-tighter transition-colors shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
