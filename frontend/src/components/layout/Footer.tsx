import type { FooterConfig } from "../../config/types";

interface Props {
  config: FooterConfig;
}

export default function Footer({ config }: Props) {
  return (
    <footer className="bg-surface-container-high w-full py-12 px-6 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
        <div className="text-xl font-black text-primary uppercase font-headline">{config.brand}</div>
        <p className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">
          {config.copyright}
        </p>
      </div>
    </footer>
  );
}
