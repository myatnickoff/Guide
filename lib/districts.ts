export type District = {
  slug: string;
  name: string;
  tagline: string;
  atmosphere: string;
  audience: string;
  image: string;
  beaches: string[];
  food: string[];
  spots: string[];
  nightlife: string[];
  scams: string[];
  meeting: string[];
};

const TBD = "[Уточнить актуальные данные]";

export const districts: District[] = [
  {
    slug: "patong",
    name: "Patong",
    tagline: "Эпицентр ночной жизни",
    atmosphere: "Неон, тусовки 24/7, Бангла-роуд. Максимальный уровень 21+.",
    audience: "Тусовщикам, любителям ночной жизни и тем, кто хочет быть в центре событий.",
    image: "photo-1530789253388-582c481c54b0",
    beaches: ["Патонг: шумный городской пляж, много инфраструктуры.", `Чистота воды, тень: ${TBD}`],
    food: [`Топ проверенных кафе и ресторанов: ${TBD}`],
    spots: [`Смотровые и закаты: ${TBD}`],
    nightlife: ["Клубы, go-go и стрип-бары, шумная ночь, знакомства.", `Проверенные заведения без накрутки чеков: ${TBD}`, "Каннабис: только по медицинскому рецепту; курение в общественных местах запрещено."],
    scams: ["Меню без цен — уточняйте стоимость до заказа.", "Навязанные напитки и «special»-предложения без прозрачной цены.", "Зазывалы: короткий вежливый отказ."],
    meeting: ["Бангла-роуд и клубная сцена Патонга.", `Неформальные тусовки: ${TBD}`],
  },
  {
    slug: "bangtao",
    name: "Bangtao / Cherngtalay",
    tagline: "Премиальные beach clubs и спикизи",
    atmosphere: "Средний, премиальный уровень 21+. Пляжные клубы и закаты.",
    audience: "Тем, кто ищет стильный вечер и камерные бары; для go-go и клубной сцены — Патонг.",
    image: "photo-1519046904884-53103b34b206",
    beaches: [`Пляж Банг Тао: ${TBD}`],
    food: [`Рестораны и кафе: ${TBD}`],
    spots: [`Смотровые и закаты: ${TBD}`],
    nightlife: ["Beach clubs, спикизи.", `Проверенные споты: ${TBD}`],
    scams: [`Схемы скама в районе: ${TBD}`],
    meeting: [`Места знакомств: ${TBD}`],
  },
  {
    slug: "karon-kata",
    name: "Karon & Kata",
    tagline: "Live music, закаты, пары",
    atmosphere: "Средний, расслабленный уровень 21+.",
    audience: "Парам и тем, кому нужен спокойный вечер; для go-go и клубов — Патонг.",
    image: "photo-1500375592092-40eb2168fd21",
    beaches: ["Большие пляжи с мягким песком, туристично.", `Чистота воды, тень: ${TBD}`],
    food: [`Кафе и рестораны: ${TBD}`],
    spots: [`Закаты и смотровые: ${TBD}`],
    nightlife: ["Бары с live music.", `Проверенные споты: ${TBD}`],
    scams: [`Схемы скама в районе: ${TBD}`],
    meeting: [`Места знакомств: ${TBD}`],
  },
  {
    slug: "rawai-nai-harn",
    name: "Rawai & Nai Harn",
    tagline: "Экспаты и спокойные бары",
    atmosphere: "Низкий/средний уровень 21+. Европейский тропический вайб.",
    audience: "Тем, кто хочет тихие бары и локальную атмосферу; для go-go — Патонг.",
    image: "photo-1518837695005-2083093ee35b",
    beaches: [`Пляжи: ${TBD}`],
    food: [`Кафе и рестораны: ${TBD}`],
    spots: [`Закаты и смотровые: ${TBD}`],
    nightlife: ["Спокойные бары.", `Проверенные споты: ${TBD}`],
    scams: [`Схемы скама в районе: ${TBD}`],
    meeting: [`Места знакомств: ${TBD}`],
  },
  {
    slug: "phuket-town",
    name: "Phuket Town",
    tagline: "Коктейли, джаз, спикизи",
    atmosphere: "Средний городской уровень 21+. Old Town, Thalang Road.",
    audience: "Тем, кто любит коктейльные бары и музыку; для go-go — Патонг.",
    image: "photo-1519608487953-e999c86e7455",
    beaches: ["Пляжей нет — выезд на западное побережье."],
    food: [`Кафе и рестораны: ${TBD}`],
    spots: ["Thalang Road, воскресный рынок (по данным гайда)."],
    nightlife: ["Коктейльные бары, джаз, спикизи.", `Проверенные споты: ${TBD}`],
    scams: [`Схемы скама в районе: ${TBD}`],
    meeting: [`Места знакомств: ${TBD}`],
  },
  {
    slug: "kamala-surin",
    name: "Kamala / Surin",
    tagline: "Закаты и электронная музыка",
    atmosphere: "Средний, премиальный уровень 21+.",
    audience: "Тем, кто хочет закаты и beach clubs; для go-go — Патонг.",
    image: "photo-1473116763249-2faaef81ccda",
    beaches: [`Пляжи: ${TBD}`],
    food: [`Кафе и рестораны: ${TBD}`],
    spots: [`Закаты: ${TBD}`],
    nightlife: ["Beach clubs, электронная музыка.", `Проверенные споты: ${TBD}`],
    scams: [`Схемы скама в районе: ${TBD}`],
    meeting: [`Места знакомств: ${TBD}`],
  },
];

export const getDistrict = (slug: string) => districts.find((d) => d.slug === slug);
export const unsplash = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;