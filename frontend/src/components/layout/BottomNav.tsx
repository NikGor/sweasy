import Icon from "../ui/Icon";

const items = [
  { icon: "explore", label: "Guide", href: "#", filled: true },
  { icon: "grid_view", label: "Feed", href: "#feed", filled: false },
  { icon: "tour", label: "Tours", href: "#tours", filled: false },
  { icon: "info", label: "Facts", href: "#facts", filled: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex md:hidden justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl border-t border-primary/10 z-50 rounded-t-3xl shadow-[0_-8px_24px_rgba(0,47,108,0.1)]">
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 active:scale-90 text-primary/60"
        >
          <Icon name={item.icon} filled={item.filled} className="mb-1" />
          <span className="font-bold text-[10px] uppercase">{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
