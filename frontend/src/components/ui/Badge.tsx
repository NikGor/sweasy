interface BadgeProps {
  text: string;
  bg: string;
  color: string;
  rotate?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

export default function Badge({ text, bg, color, rotate = "", className = "", as: Tag = "h2" }: BadgeProps) {
  return (
    <div className={`${bg} ${color} px-6 py-3 rounded-lg transform ${rotate} shadow-xl inline-block ${className}`}>
      <Tag className="font-headline font-black tracking-tighter uppercase text-inherit">{text}</Tag>
    </div>
  );
}
