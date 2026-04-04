import type { FooterConfig } from "../../config/types";

interface Props {
  config: FooterConfig;
}

export default function Footer({ config }: Props) {
  return (
    <footer className="bg-surface-container-high dark:bg-[#050811] w-full py-8 sm:py-12 px-4 sm:px-6 md:px-8 pb-24 md:pb-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 w-full max-w-7xl mx-auto">
        <div className="text-lg sm:text-xl font-black text-primary dark:text-white uppercase font-headline">{config.brand}</div>
        <p className="font-bold text-xs sm:text-sm uppercase tracking-widest text-on-surface-variant dark:text-white/50 text-center">
          {config.copyright}
        </p>
      </div>
    </footer>
  );
}
