interface BadgeProps {
  text: string;
  bg: string;
  color: string;
  rotate?: string;
  className?: string;
}

export default function Badge({ text, bg, color, rotate = "", className = "" }: BadgeProps) {
  return (
    <div className={`${bg} ${color} px-6 py-3 rounded-lg transform ${rotate} shadow-xl inline-block ${className}`}>
      <h2 className="font-headline font-black tracking-tighter uppercase text-inherit">{text}</h2>
    </div>
  );
}
