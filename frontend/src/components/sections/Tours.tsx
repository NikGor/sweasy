import Icon from "../ui/Icon";
import Badge from "../ui/Badge";
import type { ToursConfig } from "../../config/types";

interface Props {
  config: ToursConfig;
}

export default function Tours({ config }: Props) {
  return (
    <section id="tours" className="py-16 md:py-24 px-6 md:px-8 bg-surface-container-low">
      <div className="mb-10 md:mb-16">
        <h3 className="font-headline font-black text-3xl md:text-6xl text-primary tracking-tighter uppercase">
          {config.title}
        </h3>
        <p className="text-on-surface-variant font-bold uppercase tracking-widest mt-2 text-sm">
          {config.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {config.tours.map((tour) => (
          <div
            key={tour.title}
            className="group relative rounded-2xl overflow-hidden bg-surface-container-high flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden shrink-0">
              <img
                src={tour.image_url}
                alt={tour.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="absolute top-4 left-4">
              <Badge {...tour.badge} className="text-xs" />
            </div>
            <div className="p-6 flex flex-col grow">
              <h4 className="font-headline font-black text-xl text-primary uppercase tracking-tighter mb-2">
                {tour.title}
              </h4>
              <p className="text-on-surface-variant text-sm mb-4 leading-relaxed grow">
                {tour.description}
              </p>
              <button className="bg-primary text-white font-headline font-black text-sm px-6 py-3 rounded-xl hover:bg-primary-container transition-all flex items-center gap-2 uppercase tracking-tighter">
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
