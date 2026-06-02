export type HeroSlide = {
  img: string;
  tag: string;
  title: string;
  sub: string;
  cta: string;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    img: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=1400&q=85",
    tag: "Featured Drop",
    title: "Maximum Taste\nNo Sugar",
    sub: "Discover the boldest flavors from top beverage brands worldwide.",
    cta: "Shop Now",
  },
  {
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=85",
    tag: "Direct from Source",
    title: "Fresh from\nthe Factory",
    sub: "Straight from manufacturers to your doorstep. No middlemen.",
    cta: "Explore",
  },
  {
    img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=1400&q=85",
    tag: "Wholesale Deals",
    title: "Shop Smarter\nwith Kart",
    sub: "Your one-stop wholesale marketplace for every need.",
    cta: "Get Started",
  },
];
