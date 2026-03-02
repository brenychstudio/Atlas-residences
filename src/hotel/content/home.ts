import { t, type Lang } from "../../content/languages";

export function getHomeCopy(lang: Lang) {
  return {
    headline: t(lang, "A quiet boutique hotel in Barcelona.", "Un hotel boutique tranquilo en Barcelona."),
    sub: t(
      lang,
      "Direct booking focus. Editorial design. Performance-first.",
      "Enfoque en reservas directas. Diseño editorial. Rendimiento primero."
    ),
  };
}