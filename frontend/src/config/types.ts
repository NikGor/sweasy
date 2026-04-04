// Types matching the Pydantic PageConfig models

export interface BadgeConfig {
  text: string;
  bg: string;
  color: string;
  rotate: string;
}

export interface PostCardConfig {
  image_url: string;
  alt: string;
  caption: string;
  badge: BadgeConfig;
  offset: boolean;
}

export interface FactCardConfig {
  num: string;
  title: string;
  text: string;
  bg: string;
  numColor: string;
}

export interface TourCardConfig {
  title: string;
  description: string;
  image_url: string;
  badge: BadgeConfig;
}

export interface MoodBarConfig {
  label: string;
  status: string;
}

export interface NavbarConfig {
  brand: string;
}

export interface FooterConfig {
  brand: string;
  copyright: string;
}

export interface HeroConfig {
  image_url: string;
  badges: BadgeConfig[];
  subtitle: string;
}

export interface LiveFeedConfig {
  title: string;
  subtitle: string;
  posts: PostCardConfig[];
}

export interface ToursConfig {
  title: string;
  subtitle: string;
  tours: TourCardConfig[];
}

export interface FactsConfig {
  title: string;
  subtitle: string;
  facts: FactCardConfig[];
}

export interface CTAConfig {
  headline: string;
}

export interface PageConfig {
  navbar: NavbarConfig;
  mood_bar: MoodBarConfig;
  hero: HeroConfig;
  live_feed: LiveFeedConfig;
  tours: ToursConfig;
  facts: FactsConfig;
  cta: CTAConfig;
  footer: FooterConfig;
}
