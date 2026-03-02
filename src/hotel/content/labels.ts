import { t, type Lang } from "../../content/languages";

export function getHotelLabels(lang: Lang) {
  return {
    // nav / sections
    rooms: t(lang, "Rooms", "Habitaciones"),
    offers: t(lang, "Offers", "Ofertas"),
    experiences: t(lang, "Experiences", "Experiencias"),
    contact: t(lang, "Contact", "Contacto"),
    location: t(lang, "Location", "Ubicación"),

    // common actions
    viewAll: t(lang, "View all", "Ver todo"),
    book: t(lang, "Book", "Reservar"),
    bookNow: t(lang, "Book now", "Reservar"),
    exploreRooms: t(lang, "Explore rooms", "Ver habitaciones"),

    // back links
    backToRooms: t(lang, "Back to rooms", "Volver a habitaciones"),
    backToOffers: t(lang, "Back to offers", "Volver a ofertas"),
    backToExperiences: t(lang, "Back to experiences", "Volver a experiencias"),

    // gallery
    gallery: t(lang, "Gallery", "Galería"),
    tapFull: t(lang, "Tap to view full size", "Toca para ver en grande"),
    cinematicPreview: t(lang, "Cinematic preview", "Vista previa"),

    // offer detail
    included: t(lang, "Included", "Incluye"),
    terms: t(lang, "Terms", "Términos"),
    contactUs: t(lang, "Contact us", "Contacto"),
    bookThisOffer: t(lang, "Book this offer", "Reservar"),

    // reviews
    guestNotes: t(lang, "Guest notes", "Reseñas"),

    // room facts / amenities
    guests: t(lang, "Guests", "Huéspedes"),
    size: t(lang, "Size", "Tamaño"),
    beds: t(lang, "Beds", "Camas"),
    from: t(lang, "From", "Desde"),
    amenities: t(lang, "Amenities", "Comodidades"),

    // sticky bars
    bookDirect: t(lang, "Book direct", "Reserva directa"),
    directBooking: t(lang, "Direct booking", "Reserva directa"),
  };
}