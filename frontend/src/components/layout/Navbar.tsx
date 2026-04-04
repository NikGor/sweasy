import type { NavbarConfig } from "../../config/types";

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
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-8 py-4">
      <a href="#" className="text-2xl font-black text-primary tracking-tighter uppercase font-headline">
        {config.brand}
      </a>
      <div className="hidden md:flex items-center gap-8">
        {SECTIONS.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="font-headline font-black tracking-tighter uppercase transition-all duration-300 text-on-surface-variant hover:text-primary"
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
