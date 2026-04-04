interface PostCardProps {
  image: string;
  alt: string;
  caption: string;
  badge: { bg: string; color: string; rotate: string };
  offset?: boolean;
}

export default function PostCard({ image, alt, caption, badge, offset }: PostCardProps) {
  return (
    <div className={`group relative aspect-[3/4] overflow-hidden rounded-lg sm:rounded-xl bg-surface-container-high ${offset ? "sm:mt-12" : ""}`}>
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
      />
      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
        <div
          className={`${badge.bg} p-2 sm:p-4 rounded-md sm:rounded-lg transform ${badge.rotate} shadow-lg group-hover:rotate-0 transition-transform`}
        >
          <p className={`font-headline font-black ${badge.color} text-xs sm:text-lg leading-tight uppercase`}>
            {caption}
          </p>
        </div>
      </div>
    </div>
  );
}
