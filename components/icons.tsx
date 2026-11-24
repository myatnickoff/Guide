import { Umbrella, UtensilsCrossed, Coffee, Moon, BedDouble, Landmark, Camera, Mountain, Baby, Trees, Dumbbell, ShoppingBag, Music, Flower2, Store, LifeBuoy, Route as RouteIcon, Zap, Compass, MapPin, type LucideIcon } from "lucide-react";
const MAP: Record<string, LucideIcon> = {
  beaches: Umbrella, food: UtensilsCrossed, breakfast: Coffee, dinner: Moon, "unique-hotels": BedDouble, coffee: Coffee,
  attractions: Landmark, instagrammable: Camera, activities: Mountain, "kids-family": Baby, "nature-viewpoints": Trees,
  "sports-fitness": Dumbbell, shopping: ShoppingBag, nightlife: Music, wellness: Flower2, markets: Store, services: LifeBuoy,
  routes: RouteIcon, extreme: Zap, tours: Compass,
};
export function CatIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const I = MAP[slug] || MapPin;
  return <I size={size} strokeWidth={1.75} aria-hidden="true" />;
}
