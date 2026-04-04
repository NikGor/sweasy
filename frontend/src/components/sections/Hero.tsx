import Badge from "../ui/Badge";
import type { HeroConfig } from "../../config/types";

interface Props {
  config: HeroConfig;
}

export default function Hero({ config }: Props) {
  return (
    <section className="relative h-[80vh] md:h-[921px] w-full flex items-end overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url('${config.image_url}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 w-full px-6 md:px-8 pb-12 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8">
          {/* Badges */}
          <div className="flex flex-col gap-4 items-start mb-8">
            {config.badges.map((badge, i) => (
              <Badge
                key={i}
                {...badge}
                className={i === 0 ? "text-xl md:text-4xl" : "text-sm md:text-3xl ml-4 md:ml-12"}
              />
            ))}
          </div>
        </div>

        {/* Subtitle card — desktop only */}
        <div className="hidden md:flex md:col-span-4 justify-end">
          <div className="bg-surface-container-lowest/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-xs">
            <p className="text-white/80 font-medium mb-4">{config.subtitle}</p>
            <div className="flex items-center gap-2">
              <span className="w-12 h-1 bg-accent-green" />
              <span className="text-white font-black uppercase text-xs tracking-widest">
                Experience Swiss Alps
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
