import Icon from "../ui/Icon";
import type { CTAConfig } from "../../config/types";

interface Props {
  config: CTAConfig;
}

export default function CTA({ config }: Props) {
  return (
    <section className="py-12 sm:py-20 md:py-32 px-4 sm:px-6 md:px-8 flex flex-col items-center text-center bg-surface dark:bg-[#0a0f1e]">
      <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-8xl text-primary dark:text-white tracking-tighter uppercase leading-none max-w-4xl">
        {config.headline}
      </h2>

      <div className="mt-8 sm:mt-12 md:mt-16 flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center w-full max-w-2xl">
        <a
          href="#"
          className="flex-1 bg-[#FF2D55] hover:bg-[#ff4d70] text-white font-headline font-black text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-tighter shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
        >
          <Icon name="bookmark_add" filled className="text-[20px] sm:text-[24px]" />
          Забронируй своё впечатление
        </a>
        <a
          href="#tours"
          className="flex-1 bg-transparent hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-[#0a0f1e] text-primary dark:text-white border-2 border-primary dark:border-white font-headline font-black text-sm sm:text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-xl transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-tighter"
        >
          <Icon name="arrow_downward" className="text-[20px] sm:text-[24px]" />
          Смотреть ещё
        </a>
      </div>
    </section>
  );
}
