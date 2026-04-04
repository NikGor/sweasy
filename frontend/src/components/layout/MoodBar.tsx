import Icon from "../ui/Icon";
import type { MoodBarConfig } from "../../config/types";

interface Props {
  config: MoodBarConfig;
}

export default function MoodBar({ config }: Props) {
  return (
    <div className="sticky top-[60px] sm:top-[68px] md:top-[72px] z-40 bg-primary-container text-white py-2.5 sm:py-3 px-4 sm:px-6 md:px-8 flex justify-between items-center overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Icon name="psychology" filled className="text-secondary-container shrink-0" />
        <span className="font-headline font-black uppercase tracking-widest text-xs sm:text-sm truncate">
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 bg-accent-green rounded-full animate-pulse shadow-[0_0_10px_#00FF9D]" />
        <span className="font-headline font-black uppercase text-xs sm:text-sm tracking-tighter hidden sm:inline">
          {config.status}
        </span>
      </div>
    </div>
  );
}
