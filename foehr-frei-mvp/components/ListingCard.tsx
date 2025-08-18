// components/ListingCard.tsx
"use client";

import Image from "next/image";
import { Listing } from "@/lib/listings";

export default function ListingCard({ item }: { item: Listing }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
      <div className="relative w-full h-40 mb-3 overflow-hidden rounded-xl bg-gray-100">
        {/* Platzhalter-Bild falls kein echtes vorhanden */}
        <Image
          src={item.image || "/placeholder.png"}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{item.title}</h3>
        <span className="text-sm px-2 py-0.5 rounded-full border">
          {item.available ? "frei" : "belegt"}
        </span>
      </div>
      <div className="text-sm text-gray-600">{item.location}</div>
      <div className="mt-1 font-medium">{item.price} € / Nacht</div>
    </div>
  );
}
