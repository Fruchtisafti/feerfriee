// lib/listings.ts
export type Listing = {
  id: number;
  title: string;
  location: string;
  price: number;        // €/Nacht
  available: boolean;
  image: string;
};

export const LISTINGS: Listing[] = [
  { id: 1, title: "Nordsee Nest", location: "Wyk",     price: 95,  available: true,  image: "/demo/1.jpg" },
  { id: 2, title: "Düne 7",       location: "Nieblum", price: 140, available: false, image: "/demo/2.jpg" },
  { id: 3, title: "Friesenhaus",  location: "Utersum", price: 120, available: true,  image: "/demo/3.jpg" },
  // …füge gern mehr hinzu
];
