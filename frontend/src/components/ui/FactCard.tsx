interface FactCardProps {
  num: string;
  title: string;
  text: string;
  bg: string;
  numColor: string;
}

export default function FactCard({ num, title, text, bg, numColor }: FactCardProps) {
  return (
    <div className={`min-w-[280px] md:min-w-[400px] h-[360px] md:h-[500px] ${bg} rounded-3xl p-8 md:p-10 flex flex-col justify-between relative group overflow-hidden snap-center`}>
      <div className="absolute -right-10 -top-10 font-headline font-black text-[200px] text-white/10 select-none">
        {num}
      </div>
      <span className={`font-headline font-black text-5xl md:text-7xl ${numColor}`}>{num}</span>
      <div>
        <h4 className="font-headline font-black text-2xl md:text-4xl text-white uppercase tracking-tighter leading-none mb-4 md:mb-6 whitespace-pre-line">
          {title}
        </h4>
        <p className="text-white/70 font-medium leading-relaxed text-sm md:text-base">{text}</p>
      </div>
    </div>
  );
}
