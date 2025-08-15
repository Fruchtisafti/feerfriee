// lib/demoListings.ts
export type DemoListing = {
  id: string;
  title: string;
  location: string;
  persons: number;
  price: number;
  image: string;
  bookingUrl: string;
  description: string;
  amenities: string[];
};

export const demoListings: DemoListing[] = [
  {
    id: "1",
    title: "Nordseeperle",
    location: "Wyk auf Föhr",
    persons: 3,
    price: 120,
    image: "https://picsum.photos/seed/foehr1/1200/800",
    bookingUrl: "https://example.com/wyk-apartment",
    description:
      "Helles Apartment in Strandnähe. Perfekt für Paare oder kleine Familien.",
    amenities: ["WLAN", "Küche", "Balkon", "Meer-Nähe"],
  },
  {
    id: "2",
    title: "Dünenblick",
    location: "Nieblum",
    persons: 2,
    price: 95,
    image: "https://picsum.photos/seed/foehr2/1200/800",
    bookingUrl: "https://example.com/nieblum-haus",
    description:
      "Gemütliche Unterkunft mit Blick auf die Dünen. Ideal zum Abschalten.",
    amenities: ["WLAN", "Garten", "Parkplatz"],
  },
  {
    id: "3",
    title: "Inseltraum",
    location: "Utersum",
    persons: 5,
    price: 150,
    image: "https://picsum.photos/seed/foehr3/1200/800",
    bookingUrl: "https://example.com/utersum-reet",
    description:
      "Familienfreundliches Reetdach-Haus mit viel Platz und Charme.",
    amenities: ["WLAN", "Kamin", "3 Schlafzimmer", "Kinderfreundlich"],
  },
];

export function getListing(id: string) {
  return demoListings.find((l) => l.id === id) || null;
}
