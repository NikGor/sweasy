import PostCard from "../ui/PostCard";
import type { LiveFeedConfig } from "../../config/types";

interface Props {
  config: LiveFeedConfig;
}

export default function LiveFeed({ config }: Props) {
  return (
    <section id="feed" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-8 bg-surface">
      {/* Header */}
      <div className="mb-6 sm:mb-10 md:mb-16 flex justify-between items-end">
        <div>
          <h3 className="font-headline font-black text-2xl sm:text-3xl md:text-6xl text-primary tracking-tighter uppercase leading-none whitespace-pre-line">
            {config.title}
          </h3>
          <p className="mt-1 sm:mt-2 md:mt-4 text-on-surface-variant font-bold uppercase tracking-widest text-xs sm:text-sm">
            {config.subtitle}
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <span className="w-4 h-4 rounded-full bg-primary" />
          <span className="w-4 h-4 rounded-full bg-secondary" />
          <span className="w-4 h-4 rounded-full bg-tertiary-container" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
        {config.posts.map((post) => (
          <PostCard key={post.caption} {...post} image={post.image_url} />
        ))}
      </div>
    </section>
  );
}
