interface FactCardProps {
  num: string;
  title: string;
  text: string;
  bg: string;
  numColor: string;
}

export default function FactCard({ num, title, text, bg, numColor }: FactCardProps) {
  return (
    <div className={`min-w-[200px] sm:min-w-[260px] md:min-w-[340px] h-[260px] sm:h-[320px] md:h-[420px] ${bg} rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 flex flex-col justify-between relative group overflow-hidden snap-center`}>
      <div className="absolute -right-6 sm:-right-10 -top-6 sm:-top-10 font-headline font-black text-[120px] sm:text-[160px] md:text-[180px] text-white/10 select-none">
        {num}
      </div>
      <span className={`font-headline font-black text-3xl sm:text-5xl md:text-6xl ${numColor}`}>{num}</span>
      <div>
        <h4 className="font-headline font-black text-base sm:text-xl md:text-3xl text-white uppercase tracking-tighter leading-none mb-2 sm:mb-3 md:mb-5 whitespace-pre-line">
          {title}
        </h4>
        <p className="text-white/70 font-medium leading-relaxed text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">{text}</p>
      </div>
    </div>
  );
}
