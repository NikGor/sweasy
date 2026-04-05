import { useRef } from "react";
import FactCard from "../ui/FactCard";
import Icon from "../ui/Icon";
import type { FactsConfig } from "../../config/types";

interface Props {
  config: FactsConfig;
}

export default function Facts({ config }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="facts" className="py-10 sm:py-16 md:py-24 bg-surface-container-low dark:bg-[#111827] overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 mb-6 sm:mb-10 md:mb-16 flex justify-between items-end">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-6xl text-primary dark:text-white tracking-tighter uppercase">
            {config.title}
          </h2>
          <p className="text-on-surface-variant dark:text-white/60 font-bold uppercase tracking-widest mt-1 sm:mt-2 text-xs sm:text-sm">
            {config.subtitle}
          </p>
        </div>
        <div className="hidden md:flex gap-3">
          <button
            onClick={() => scroll(-1)}
            className="w-12 h-12 rounded-full bg-primary dark:bg-[#00FF9D] text-white dark:text-[#0a0f1e] flex items-center justify-center hover:bg-primary-container dark:hover:bg-[#00cc7d] transition-colors"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-12 h-12 rounded-full bg-primary dark:bg-[#00FF9D] text-white dark:text-[#0a0f1e] flex items-center justify-center hover:bg-primary-container dark:hover:bg-[#00cc7d] transition-colors"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 md:gap-8 px-4 sm:px-6 md:px-8 overflow-x-auto pb-6 sm:pb-8 md:pb-12 no-scrollbar snap-x snap-mandatory"
      >
        {config.facts.map((fact) => (
          <FactCard key={fact.num} {...fact} />
        ))}
      </div>
    </section>
  );
}
