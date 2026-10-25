import { VAPE_TEXT, gmaps } from "./config";

export type Item = { t: string; u?: string };

export type District = {
  slug: string;
  name: string;
  tagline: string;
  atmosphere: string;
  audience: string;
  image: string;
  spots: Item[];
  beaches: Item[];
  food: Item[];
  nightlife: Item[];
  massage: Item[];
  scams: Item[];
  notes: Item[];
};

const vape: Item = { t: `Вейпы: ${VAPE_TEXT}` };

export const districts: District[] = [
  {
    slug: "patong",
    name: "Patong",
    tagline: "Главный центр бурной ночной жизни",
    atmosphere: "Клубы, go-go, Bangla Road. Максимальный уровень 21+.",
    audience: "Тусовщикам, любителям ночной жизни и тем, кто хочет быть в центре событий.",
    image: "photo-1530789253388-582c481c54b0",
    spots: [
      { t: "Bangla Road", u: gmaps("Bangla Road Patong") },
      { t: "Illuzion Club", u: gmaps("Illuzion Patong") },
      { t: "KEE Sky Lounge", u: gmaps("KEE Sky Lounge Patong") },
      { t: "Paradise Complex", u: gmaps("Paradise Complex Patong") },
    ],
    beaches: [],
    food: [],
    nightlife: [
      { t: "Soi Seadragon — Suzy Wong", u: gmaps("Suzy Wong Soi Seadragon Patong") },
      { t: "Soi Seadragon — Diablo", u: gmaps("Diablo Soi Seadragon Patong") },
      { t: "Soi Seadragon — Exotica", u: gmaps("Exotica Soi Seadragon Patong") },
      { t: "Soi Vegas — Moulin Rouge", u: gmaps("Moulin Rouge Soi Vegas Patong") },
    ],
    massage: [
      { t: "Christin Massage (Rat-U-Thit Rd, soapy/adult)", u: gmaps("Christin Massage Rat-U-Thit Road Patong") },
      { t: "Let’s Relax, Jungceylon (сетевой спа)", u: gmaps("Let's Relax Jungceylon Patong") },
    ],
    scams: [
      { t: "Завышенные счета за lady drinks." },
      { t: "Меню без цен." },
      { t: "Навязанные шоу." },
    ],
    notes: [vape],
  },
  {
    slug: "bangtao",
    name: "Bangtao / Cherngtalay",
    tagline: "Премиальный, светский район",
    atmosphere: "Beach clubs, экспаты, пары.",
    audience: "Тем, кто ищет стильный вечер и камерные бары.",
    image: "photo-1519046904884-53103b34b206",
    spots: [
      { t: "Catch Beach Club", u: gmaps("Catch Beach Club Bangtao") },
      { t: "Dream Beach Club", u: gmaps("Dream Beach Club Phuket") },
      { t: "Niky’s Speakeasy", u: gmaps("Nikys Speakeasy Phuket") },
      { t: "Boat Avenue", u: gmaps("Boat Avenue Cherngtalay") },
    ],
    beaches: [],
    food: [],
    nightlife: [],
    massage: [],
    scams: [],
    notes: [
      { t: "Каннабис: Chillium (лаундж/диспансерий). Правила 2025–2026: нужен рецепт PT33.", u: gmaps("Chillium Bangtao Phuket") },
      vape,
    ],
  },
  {
    slug: "karon-kata",
    name: "Karon & Kata",
    tagline: "Серфинг, регги, закатные бары",
    atmosphere: "Умеренно живой район.",
    audience: "Парам и тем, кому нужен спокойный вечер.",
    image: "photo-1500375592092-40eb2168fd21",
    spots: [
      { t: "Ska Bar Kata", u: gmaps("Ska Bar Kata Beach") },
      { t: "After Beach Bar Kata Noi", u: gmaps("After Beach Bar Kata Noi") },
    ],
    beaches: [],
    food: [],
    nightlife: [],
    massage: [],
    scams: [],
    notes: [vape],
  },
  {
    slug: "rawai-nai-harn",
    name: "Rawai & Nai Harn",
    tagline: "Юг острова, честный local vibe",
    atmosphere: "Экспаты, долгожители, спокойные бары.",
    audience: "Тем, кто хочет тихие бары и локальную атмосферу.",
    image: "photo-1518837695005-2083093ee35b",
    spots: [
      { t: "Rawai seafront bars", u: gmaps("Rawai seafront bars Phuket") },
      { t: "Рыбный рынок Rawai", u: gmaps("Rawai Fish Market Phuket") },
      { t: "Nai Harn local spots", u: gmaps("Nai Harn Beach Phuket") },
    ],
    beaches: [],
    food: [],
    nightlife: [],
    massage: [
      { t: "Честный тайский массаж у рынка (200–350 THB)", u: gmaps("Thai massage Rawai market Phuket") },
      { t: "Nuru Spa (Soi Saiyuan)", u: gmaps("Nuru Spa Soi Saiyuan Rawai") },
    ],
    scams: [],
    notes: [
      { t: "Рядом Harmony Naturist Resort (Rawai) — единственный легальный adult-naturist курорт.", u: gmaps("Harmony Naturist Resort Rawai Phuket") },
      vape,
    ],
  },
  {
    slug: "phuket-town",
    name: "Phuket Town",
    tagline: "Городской стиль, джаз, крафт",
    atmosphere: "Спикизи-бары в старых шанхайских домах.",
    audience: "Тем, кто любит коктейльные бары и музыку.",
    image: "photo-1519608487953-e999c86e7455",
    spots: [
      { t: "The Fool Speakeasy", u: gmaps("The Fool Speakeasy Phuket Town") },
      { t: "Thalang Road / Soi Romanee", u: gmaps("Soi Romanee Phuket Town") },
    ],
    beaches: [],
    food: [],
    nightlife: [],
    massage: [],
    scams: [],
    notes: [vape],
  },
  {
    slug: "kamala-surin",
    name: "Kamala / Surin",
    tagline: "Премиальный sunset-район",
    atmosphere: "Отели, элитные пляжные клубы.",
    audience: "Тем, кто хочет закаты и beach clubs.",
    image: "photo-1473116763249-2faaef81ccda",
    spots: [
      { t: "Café del Mar Kamala", u: gmaps("Cafe del Mar Kamala Phuket") },
      { t: "RAVA Club", u: gmaps("RAVA Club Kamala Phuket") },
    ],
    beaches: [],
    food: [],
    nightlife: [],
    massage: [],
    scams: [],
    notes: [vape],
  },
];

export const getDistrict = (slug: string) => districts.find((d) => d.slug === slug);
export const unsplash = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;