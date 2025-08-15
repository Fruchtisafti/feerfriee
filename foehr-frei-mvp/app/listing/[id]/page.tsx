import Link from "next/link";
import { demoListings, getListing } from "@/lib/demoListings";

type Props = { params: { id: string } };

export async function generateStaticParams() {
  // Damit die 3 Demo-Seiten statisch gebaut werden:
  return demoListings.map((l) => ({ id: l.id }));
}

export default function ListingPage({ params }: Props) {
  const listing = getListing(params.id);
  if (!listing) {
    // Fallback einfacher 404 für nicht vorhandene IDs
    return (
      <main className="container mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-2 text-2xl font-semibold text-navy">Nicht gefunden</h1>
        <p className="text-navy/70 mb-6">
          Diese Unterkunft existiert nicht (ID: {params.id}).
        </p>
        <Link className="underline text-north" href="/">
          Zurück zur Startseite
        </Link>
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-4 text-sm">
        <Link className="underline text-north" href="/">
          ← Zurück
        </Link>
      </nav>

      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-navy">{listing.title}</h1>
        <p className="text-navy/70">
          {listing.location} · bis {listing.persons} Pers. · ab {listing.price} €
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-72 w-full object-cover"
        />
        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-navy">Beschreibung</h2>
            <p className="text-navy/80">{listing.description}</p>

            <h3 className="text-base font-semibold text-navy">Ausstattung</h3>
            <ul className="list-disc pl-5 text-navy/80">
              {listing.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-navy/70">ab</div>
              <div className="text-2xl font-semibold text-north">{listing.price} €</div>
              <div className="text-sm text-navy/70">pro Nacht</div>
            </div>
            <a
              href={listing.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full rounded bg-north px-4 py-2 text-center font-medium text-white"
            >
              Jetzt anfragen
            </a>
            <p className="text-xs text-navy/60">
              Hinweis: Anfrage/ Buchung erfolgt extern beim Vermieter.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
