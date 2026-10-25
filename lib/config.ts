export const TELEGRAM_URL = "https://t.me/MEGteam_bot";

export const VAPE_TEXT =
  "Официально вейпы запрещены законом Таиланда. На практике их свободно продают в туристических зонах, но курение на глазах у полиции влечет неофициальные штрафы на месте (от 5,000 до 25,000 THB). Держите устройства в кармане при полицейских патрулях.";

export const gmaps = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${query.trim().replace(/\s+/g, "+")}`;