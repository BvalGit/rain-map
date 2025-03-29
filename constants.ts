export const BASE_URL = "https://regnkarta.se";

export const REFLECTIVITY = [
  { level: "Lätt", color: "bg-green-500", range: "0,08-0,1 mm/timme" },
  { level: "Måttlig", color: "bg-green-300", range: "0,1-1,0 mm/timme" },
  { level: "Kraftig", color: "bg-teal-200", range: "1,0-2,5 mm/timme" },
  { level: "Intensiv", color: "bg-blue-300", range: "2,5-5,0 mm/timme" },
  { level: "Extrem", color: "bg-blue-600", range: "> 5,0 mm/timme" },
];

export const SCHEMA = {
  "@context": "https://schema.org/",
  "@type": "WebPage",
  name: "Regnradar över Sverige och Världen",
  description:
    "Se nederbörd live tillsammans med framtidsprognos via vår regnradar.",
  image: "/regnradar.webp",
  publisher: {
    "@type": "Organization",
    name: "Regnradar - Regnkarta.se",
    logo: "/header.webp",
  },
};
