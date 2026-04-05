import { Link } from "react-router-dom";
import { useEffect } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import Icon from "../ui/Icon";
import { useSEO } from "../../hooks/useSEO";
import { trackEvent } from "../../lib/analytics";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const FOOTER_CONFIG = {
  brand: "Sweasy",
  copyright: "© 2026 Sweasy. Все права защищены.",
};

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  seo: { title: string; description: string };
  eyebrow: string;
  heading: string;
  subtitle: string;
  features: Feature[];
  description: { heading: string; paragraphs: string[] };
  faq: FaqItem[];
  ctaLabel?: string;
  jsonLd?: Record<string, unknown>;
}

export default function ServiceLayout({
  seo,
  eyebrow,
  heading,
  subtitle,
  features,
  description,
  faq,
  ctaLabel = "Написать в Telegram",
  jsonLd,
}: Props) {
  useSEO({ title: seo.title, description: seo.description });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [heading]);

  useEffect(() => {
    if (!jsonLd) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "service-jsonld";
    el.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, [jsonLd]);

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

      <main className="grow">
        {/* Hero */}
        <section className="relative bg-primary dark:bg-[#0a0f1e] pt-28 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-28 px-4 sm:px-6 md:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80 dark:from-[#0a0f1e] dark:via-[#111827] dark:to-[#0a0f1e]" />
          <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-[#FF2D55]/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 bottom-0 w-72 h-72 rounded-full bg-[#00FF9D]/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-4xl">
            <span className="inline-block bg-white/10 text-white/80 text-xs font-headline font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 sm:mb-6">
              {eyebrow}
            </span>
            <h1 className="font-headline font-black text-3xl sm:text-5xl md:text-7xl text-white tracking-tighter uppercase leading-none mb-4 sm:mb-6">
              {heading}
            </h1>
            <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mb-8 sm:mb-10">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_click", { location: "service_hero", target: "telegram" })}
                className="bg-[#229ED9] hover:bg-[#3aafe3] text-white font-headline font-black text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-tighter shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
              >
                <Icon name="send" filled className="text-[18px]" />
                {ctaLabel}
              </a>
              <Link
                to="/"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-headline font-black text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-tighter"
              >
                <Icon name="arrow_back" className="text-[18px]" />
                На главную
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 md:px-8 bg-surface-container-low dark:bg-[#111827]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-surface dark:bg-[#0a0f1e] rounded-2xl p-5 sm:p-6 border border-primary/10 dark:border-white/10"
              >
                <span className="material-symbols-outlined text-[32px] text-primary dark:text-[#00FF9D] mb-3 block">
                  {f.icon}
                </span>
                <h3 className="font-headline font-black text-sm sm:text-base text-primary dark:text-white uppercase tracking-tighter mb-2">
                  {f.title}
                </h3>
                <p className="text-on-surface-variant dark:text-white/60 text-xs sm:text-sm leading-relaxed">
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 md:px-8 bg-surface dark:bg-[#0a0f1e]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline font-black text-2xl sm:text-4xl md:text-5xl text-primary dark:text-white tracking-tighter uppercase leading-none mb-8 sm:mb-10">
              {description.heading}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {description.paragraphs.map((p, i) => (
                <p key={i} className="text-on-surface dark:text-white/80 text-sm sm:text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 md:px-8 bg-surface-container-low dark:bg-[#111827]">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-headline font-black text-2xl sm:text-4xl md:text-5xl text-primary dark:text-white tracking-tighter uppercase leading-none mb-8 sm:mb-10">
                Часто задают
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {faq.map((item) => (
                  <details
                    key={item.q}
                    className="group bg-surface dark:bg-[#0a0f1e] rounded-2xl border border-primary/10 dark:border-white/10 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 cursor-pointer select-none font-headline font-black text-sm sm:text-base text-primary dark:text-white uppercase tracking-tighter list-none">
                      {item.q}
                      <span className="material-symbols-outlined text-[20px] shrink-0 ml-4 transition-transform group-open:rotate-45">
                        add
                      </span>
                    </summary>
                    <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-on-surface dark:text-white/70 text-sm sm:text-base leading-relaxed border-t border-primary/10 dark:border-white/10 pt-3 sm:pt-4">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 bg-primary dark:bg-[#111827]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-headline font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tighter uppercase leading-none mb-4 sm:mb-6">
              Готов в путь?
            </h2>
            <p className="text-white/70 text-sm sm:text-base mb-8 sm:mb-10 leading-relaxed">
              Напиши нам в Telegram — обсудим маршрут, даты и всё, что важно именно тебе.
            </p>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_click", { location: "service_bottom", target: "telegram" })}
              className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#3aafe3] text-white font-headline font-black text-sm sm:text-base px-8 py-4 rounded-xl transition-all uppercase tracking-tighter shadow-[3px_3px_0_0_rgba(0,0,0,0.3)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
            >
              <Icon name="send" filled className="text-[20px]" />
              Написать в Telegram
            </a>
          </div>
        </section>
      </main>

      <Footer config={FOOTER_CONFIG} />
      <BottomNav />
    </div>
  );
}
