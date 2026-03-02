import { t, type Lang } from "../../content/languages";

export type NavItem = { href: string; label: string };

export function getHotelNav(lang: Lang): NavItem[] {
  return [
    { href: `/${lang}/rooms/`, label: t(lang, "Rooms", "Habitaciones") },
    { href: `/${lang}/offers/`, label: t(lang, "Offers", "Ofertas") },
    { href: `/${lang}/experiences/`, label: t(lang, "Experiences", "Experiencias") },
    { href: `/${lang}/contact/`, label: t(lang, "Contact", "Contacto") },
    { href: `/${lang}/location/`, label: t(lang, "Location", "Ubicación") },
  ];
}

export function getHotelCtaLabel(lang: Lang) {
  return t(lang, "Book", "Reservar");
}