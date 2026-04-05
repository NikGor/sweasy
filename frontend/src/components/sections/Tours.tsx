import Icon from "../ui/Icon";
import Badge from "../ui/Badge";
import type { ToursConfig } from "../../config/types";
import { trackEvent } from "../../lib/analytics";

interface Props {
  config: ToursConfig;
}

export default function Tours({ config }: Props) {
  return (
    <section id="tours" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-surface-container-low dark:bg-[#111827]">
      <div className="mb-6 sm:mb-10 md:mb-16">
        <h2 className="font-headline font-black text-2xl sm:text-3xl md:text-6xl text-primary dark:text-white tracking-tighter uppercase">
          {config.title}
        </h2>
        <p className="text-on-surface-variant dark:text-white/60 font-bold uppercase tracking-widest mt-1 sm:mt-2 text-xs sm:text-sm">
          {config.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {config.tours.map((tour) => (
          <div
            key={tour.title}
            className="group relative rounded-2xl overflow-hidden bg-surface-container-high dark:bg-[#1a2133] flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden shrink-0">
              <img
                src={tour.image_url}
                alt={tour.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
              <Badge {...tour.badge} className="text-xs" />
            </div>
            <div className="p-4 sm:p-6 flex flex-col grow">
              <h3 className="font-headline font-black text-lg sm:text-xl text-primary dark:text-white uppercase tracking-tighter mb-1 sm:mb-2">
                {tour.title}
              </h3>
              <p className="text-on-surface-variant dark:text-white/70 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed grow">
                {tour.description}
              </p>
              <button
                onClick={() => trackEvent("tour_interest", { tour_name: tour.title })}
                className="bg-primary dark:bg-[#00FF9D] text-white dark:text-[#0a0f1e] font-headline font-black text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-primary-container dark:hover:bg-[#00cc7d] transition-all flex items-center gap-2 uppercase tracking-tighter w-fit"
              >
                <Icon name="explore" />
                Хочу сюда в тур
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
