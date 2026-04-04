import Icon from "../ui/Icon";
import type { MoodBarConfig } from "../../config/types";

interface Props {
  config: MoodBarConfig;
}

export default function MoodBar({ config }: Props) {
  return (
    <div className="sticky top-[72px] z-40 bg-primary-container text-white py-3 px-6 md:px-8 flex justify-between items-center overflow-hidden">
      <div className="flex items-center gap-4">
        <Icon name="psychology" filled className="text-secondary-container" />
        <span className="font-headline font-black uppercase tracking-widest text-sm">
          {config.label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse shadow-[0_0_10px_#00FF9D]" />
        <span className="font-headline font-black uppercase text-sm tracking-tighter hidden sm:inline">
          {config.status}
        </span>
      </div>
    </div>
  );
}
