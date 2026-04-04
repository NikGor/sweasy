import type { NavbarConfig } from "../../config/types";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "../ui/LanguageSwitcher";

interface Props {
  config: NavbarConfig;
}

const SECTIONS = [
  { label: "Feed", href: "#feed" },
  { label: "Tours", href: "#tours" },
  { label: "Facts", href: "#facts" },
];

export default function Navbar({ config }: Props) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-[#0a0f1e]/80 backdrop-blur-xl flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4">
      <a href="#" className="text-xl sm:text-2xl font-black text-primary dark:text-white tracking-tighter uppercase font-headline">
        {config.brand}
      </a>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
        <ThemeToggle />
        <LanguageSwitcher />
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="font-headline font-black tracking-tighter uppercase transition-all duration-300 text-on-surface-variant dark:text-white/70 hover:text-primary dark:hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
