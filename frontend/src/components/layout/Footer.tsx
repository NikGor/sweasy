import { Link } from "react-router-dom";
import type { FooterConfig } from "../../config/types";

interface Props {
  config: FooterConfig;
}

const SECTIONS = [
  { label: "Лента", href: "/#feed" },
  { label: "Туры", href: "/#tours" },
  { label: "Факты", href: "/#facts" },
];

const LEGAL = [
  { label: "Impressum", to: "/impressum" },
  { label: "Конфиденциальность", to: "/privacy" },
  { label: "Условия", to: "/terms" },
  { label: "Cookies", to: "/cookies" },
];

const SOCIALS = [
  { label: "Telegram", href: "https://t.me/", icon: "send" },
  { label: "Instagram", href: "https://instagram.com/", icon: "photo_camera" },
  { label: "YouTube", href: "https://youtube.com/", icon: "smart_display" },
];

export default function Footer({ config }: Props) {
  return (
    <footer className="bg-surface-container-high dark:bg-[#050811] w-full pt-12 sm:pt-16 md:pt-20 pb-24 md:pb-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16">
          {/* Brand column */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-primary dark:text-white uppercase font-headline tracking-tighter mb-3">
              {config.brand}
            </div>
            <p className="text-on-surface-variant dark:text-white/60 text-sm leading-relaxed max-w-xs">
              Авторские туры по Швейцарии с русскоязычным гидом. Настоящая страна глазами тех, кто в ней влюблён.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-headline font-black text-xs text-on-surface-variant dark:text-white/50 uppercase tracking-widest mb-4">
              Навигация
            </h4>
            <ul className="space-y-2.5">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="text-primary dark:text-white font-headline font-black text-sm uppercase tracking-tighter hover:text-[#FF2D55] dark:hover:text-[#00FF9D] transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-headline font-black text-xs text-on-surface-variant dark:text-white/50 uppercase tracking-widest mb-4">
              Правовая информация
            </h4>
            <ul className="space-y-2.5">
              {LEGAL.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-primary dark:text-white font-headline font-black text-sm uppercase tracking-tighter hover:text-[#FF2D55] dark:hover:text-[#00FF9D] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts & socials */}
          <div>
            <h4 className="font-headline font-black text-xs text-on-surface-variant dark:text-white/50 uppercase tracking-widest mb-4">
              Контакты
            </h4>
            <ul className="space-y-2.5 mb-5">
              <li>
                <a
                  href="mailto:hello@sweasy.ch"
                  className="text-primary dark:text-white font-headline font-black text-sm tracking-tighter hover:text-[#FF2D55] dark:hover:text-[#00FF9D] transition-colors break-all"
                >
                  hello@sweasy.ch
                </a>
              </li>
            </ul>
            <div className="flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl border-2 border-primary dark:border-white text-primary dark:text-white flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-[#0a0f1e] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-primary/10 dark:border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-white/50 text-center md:text-left">
            {config.copyright}
          </p>
          <p className="font-bold text-xs uppercase tracking-widest text-on-surface-variant dark:text-white/50 text-center md:text-right">
            Made in Switzerland
          </p>
        </div>
      </div>
    </footer>
  );
}
