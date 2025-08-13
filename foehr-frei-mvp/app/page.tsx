'use client';

import { useEffect, useMemo, useState } from 'react';

function safeUUID() {
  try {
    if (
      typeof window !== 'undefined' &&
      window.crypto &&
      'randomUUID' in window.crypto
    ) {
      return window.crypto.randomUUID();
    }
  } catch {}
  // Fallback
  return 'id-' + Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
}

function safeUUID() {
  try {
    // Browser-Variante
    if (typeof window !== "undefined" && window.crypto && "randomUUID" in window.crypto) {
      return window.crypto.randomUUID();
    }
  } catch {}
  // Fallback
  return "id-" + Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}

"use client";

import { useEffect, useMemo, useState } from "react";

const VILLAGES = [
  "Wyk", "Nieblum", "Utersum", "Oldsum", "Alkersum", "Borgsum", "Dunsum", "Witsum", "Oevenum", "Midlum", "Süderende"
];

function todayAtMidnight() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmtYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fmtHuman(date: Date) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" }).format(date);
}

function rangeDays(start: Date, endExclusive: Date) {
  const res: Date[] = [];
  let d = new Date(start);
  while (d < endExclusive) {
    res.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return res;
}

function normalizeICS(icsText: string) {
  return icsText.replace(/\r?\n[ \t]/g, "");
}

function parseICS(icsText: string) {
  const text = normalizeICS(icsText);
  const events: { start: Date; end: Date }[] = [];
  const parts = text.split(/BEGIN:VEVENT/).slice(1).map(b => "BEGIN:VEVENT" + b);
  for (const block of parts) {
    const dtstartMatch = block.match(/DTSTART[^:]*:([^\r\n]+)/);
    const dtendMatch = block.match(/DTEND[^:]*:([^\r\n]+)/);
    if (!dtstartMatch || !dtendMatch) continue;
    const start = parseICSDate(dtstartMatch[1]);
    const end = parseICSDate(dtendMatch[1]);
    if (start && end && end > start) {
      events.push({ start, end });
    }
  }
  return events;
}

function parseICSDate(val: string) {
  try {
    if (/^\d{8}$/.test(val)) {
      const y = parseInt(val.slice(0, 4), 10);
      const m = parseInt(val.slice(4, 6), 10) - 1;
      const d = parseInt(val.slice(6, 8), 10);
      const dt = new Date(y, m, d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    }
    if (/^\d{8}T\d{6}Z$/.test(val)) {
      return new Date(val.replace(/^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/, "$1-$2-$3T$4:$5:$6Z"));
    }
    if (/^\d{8}T\d{6}$/.test(val)) {
      const y = parseInt(val.slice(0, 4), 10);
      const m = parseInt(val.slice(4, 6), 10) - 1;
      const d = parseInt(val.slice(6, 8), 10);
      const hh = parseInt(val.slice(9, 11), 10);
      const mm = parseInt(val.slice(11, 13), 10);
      const ss = parseInt(val.slice(13, 15), 10);
      return new Date(y, m, d, hh, mm, ss);
    }
    return new Date(val);
  } catch {
    return null as any;
  }
}

function buildBookedSet(events: {start: Date; end: Date}[], horizonDays = 30) {
  const start = todayAtMidnight();
  const end = addDays(start, horizonDays);
  const booked = new Set<string>();
  for (const ev of events) {
    const evStart = ev.start < start ? start : ev.start;
    const evEnd = ev.end > end ? end : ev.end;
    if (evEnd <= start || evStart >= end) continue;
    const days = rangeDays(evStart, evEnd);
    for (const d of days) {
      booked.add(fmtYMD(d));
    }
  }
  return booked;
}

function computeWindows(bookedSet: Set<string>, horizonDays = 30) {
  const start = todayAtMidnight();
  const days = Array.from({ length: horizonDays }, (_, i) => addDays(start, i));
  const windows: { start: Date; length: number }[] = [];
  let cur: { start: Date; length: number } | null = null;
  for (const d of days) {
    const ymd = fmtYMD(d);
    const isFree = !bookedSet.has(ymd);
    if (isFree) {
      if (!cur) cur = { start: new Date(d), length: 1 };
      else cur.length += 1;
    } else if (cur) {
      windows.push(cur);
      cur = null;
    }
  }
  if (cur) windows.push(cur);
  return windows;
}

function nextWindowMeetingNights(
  windows: { start: Date; length: number }[],
  nights: number,
  fromDate = todayAtMidnight()
) {
  for (const w of windows) {
    if (w.start >= stripTime(fromDate) && w.length >= nights) return w;
  }
  return null;
}

function stripTime(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function CalendarPreview({ bookedSet, horizonDays = 30 }:{bookedSet:Set<string>|null, horizonDays?:number}) {
  const start = todayAtMidnight();
  const days = Array.from({ length: horizonDays }, (_, i) => addDays(start, i));
  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {days.map((d) => {
        const ymd = fmtYMD(d);
        const free = !bookedSet?.has(ymd);
        return (
          <div key={ymd} className={`rounded p-2 text-center border ${free ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <div className="font-medium">{fmtHuman(d)}</div>
            <div className="opacity-60">{free ? "frei" : "belegt"}</div>
          </div>
        );
      })}
    </div>
  );
}

type Listing = {
  id: string;
  title: string;
  location: string;
  persons: number;
  priceFrom: number;
  bookingUrl: string;
  icsUrl?: string;
  bookedSet: Set<string>;
  windows: { start: Date; length: number }[];
};

export default function Page() {
  const [tab, setTab] = useState<"guest"|"host">("guest");
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("foehrfrei_listings");
    if (raw) {
      const parsed = JSON.parse(raw);
      // revive Sets and Dates
      const revived: Listing[] = parsed.map((l:any)=> ({
        ...l,
        bookedSet: new Set(l.bookedSet),
        windows: (l.windows || []).map((w:any)=>({ start: new Date(w.start), length: w.length }))
      }));
      setListings(revived);
    }
  }, []);

  useEffect(() => {
    const serializable = listings.map(l => ({
      ...l,
      bookedSet: Array.from(l.bookedSet)
    }));
    localStorage.setItem("foehrfrei_listings", JSON.stringify(serializable));
  }, [listings]);

  return (
    <div className="container">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Föhr Frei <span className="text-slate-500">– Last‑Minute Unterkünfte</span></h1>
        <button
          onClick={()=>loadDemo(setListings)}
          className="text-sm px-3 py-2 rounded border hover:bg-slate-50"
        >Demo laden</button>
      </header>

      <div className="mb-4 flex gap-2">
        <button className={`px-3 py-2 rounded border ${tab==="guest"?"bg-slate-900 text-white":"bg-white"}`} onClick={()=>setTab("guest")}>Für Gäste</button>
        <button className={`px-3 py-2 rounded border ${tab==="host"?"bg-slate-900 text-white":"bg-white"}`} onClick={()=>setTab("host")}>Für Vermieter</button>
      </div>

      {tab === "guest" ? (
        <GuestSearch listings={listings} onLoadDemo={()=>loadDemo(setListings)} />
      ) : (
        <HostOnboarding addListing={(l)=>setListings(prev=>[...prev, l])} setListings={setListings} />
      )}

      <footer className="mt-12 text-xs text-slate-500">
        <p>Prototyp (MVP). Keine Zahlungsabwicklung. Angezeigte Verfügbarkeiten basieren auf Kalenderdaten der Vermieter.</p>
      </footer>
    </div>
  );
}

function GuestSearch({ listings, onLoadDemo }:{listings: Listing[], onLoadDemo: ()=>void}) {
  const [start, setStart] = useState<string>(fmtYMD(todayAtMidnight()));
  const [nights, setNights] = useState<number>(3);
  const [persons, setPersons] = useState<number>(2);
  const [priceMax, setPriceMax] = useState<number>(0);
  const [village, setVillage] = useState<string>("Alle Orte");

  const results = useMemo(() => {
    const fromDate = new Date(start);
    return listings
      .map((l) => {
        const matchVillage = village === "Alle Orte" || l.location === village;
        const matchPersons = persons <= (l.persons || 99);
        const matchPrice = priceMax === 0 || (l.priceFrom || 0) <= priceMax;
        const win = nextWindowMeetingNights(l.windows || [], nights, fromDate);
        const ok = matchVillage && matchPersons && matchPrice && !!win;
        return { listing: l, window: win, ok };
      })
      .filter(x => x.ok)
      .sort((a, b) => (a.window!.start as any) - (b.window!.start as any));
  }, [listings, start, nights, persons, priceMax, village]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1 sticky top-4 h-max p-4 border rounded-lg bg-white">
        <div className="mb-3">
          <label className="block text-sm font-medium">Startdatum</label>
          <input type="date" value={start} onChange={(e)=>setStart(e.target.value)} className="mt-1 w-full border rounded px-2 py-1"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Nächte</label>
          <input type="number" min={1} max={30} value={nights} onChange={(e)=>setNights(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Personen</label>
          <input type="number" min={1} max={10} value={persons} onChange={(e)=>setPersons(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1"/>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Preis bis (ab)</label>
          <input type="number" min={0} placeholder="z. B. 120" value={priceMax} onChange={(e)=>setPriceMax(Number(e.target.value))} className="mt-1 w-full border rounded px-2 py-1"/>
          <p className="text-xs text-slate-500 mt-1">0 = egal</p>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Ort</label>
          <select value={village} onChange={(e)=>setVillage(e.target.value)} className="mt-1 w-full border rounded px-2 py-1">
            <option>Alle Orte</option>
            {VILLAGES.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{results.length} Unterkünfte gefunden</h2>
          <button onClick={onLoadDemo} className="text-sm px-3 py-2 rounded border hover:bg-slate-50">Demo laden</button>
        </div>
        {results.map(({ listing, window }) => (
          <div key={listing.id} className="border rounded-lg bg-white">
            <div className="p-4 flex items-center justify-between border-b">
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <span>{listing.title}</span>
                  <span className="text-xs border rounded px-2 py-0.5 bg-slate-50">{listing.location}</span>
                  <span className="text-xs border rounded px-2 py-0.5">bis {listing.persons} Pers.</span>
                </div>
                <div className="text-sm text-slate-500">ab {listing.priceFrom ? `${listing.priceFrom} € / Nacht` : "—"}</div>
              </div>
              <a href={listing.bookingUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded bg-slate-900 text-white">
                Jetzt anfragen
              </a>
            </div>
            <div className="p-4 grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="text-sm">Nächste freie Zeit für {window!.length} Nächte ab <strong>{fmtHuman(window!.start)}</strong></div>
                <div className="mt-3"><CalendarPreview bookedSet={listing.bookedSet} /></div>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Buchungslink: </span><a className="underline" href={listing.bookingUrl} target="_blank" rel="noreferrer">Öffnen</a></div>
                {listing.icsUrl && <div className="truncate"><span className="font-medium">Kalender: </span><a className="underline" href={listing.icsUrl} target="_blank" rel="noreferrer">ICS</a></div>}
                <div className="text-xs text-slate-500">Hinweis: Kalender zeigt nur die nächsten 30 Tage.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HostOnboarding({ addListing, setListings }:{ addListing:(l:Listing)=>void, setListings:(fn:any)=>void }) {
  const [title, setTitle] = useState<string>("");
  const [location, setLocation] = useState<string>("Wyk");
  const [persons, setPersons] = useState<number>(2);
  const [priceFrom, setPriceFrom] = useState<number>(0);
  const [bookingUrl, setBookingUrl] = useState<string>("");
  const [icsUrl, setIcsUrl] = useState<string>("");
  const [icsText, setIcsText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [bookedSet, setBookedSet] = useState<Set<string> | null>(null);
  const [windows, setWindows] = useState<{start:Date; length:number}[]>([]);
  const [loadingICS, setLoadingICS] = useState<boolean>(false);

  function resetPreview() {
    setBookedSet(null);
    setWindows([]);
    setError("");
  }

  async function fetchICS() {
    setError("");
    setLoadingICS(true);
    try {
      const res = await fetch(icsUrl);
      const text = await res.text();
      setIcsText(text);
      const events = parseICS(text);
      const b = buildBookedSet(events);
      setBookedSet(b);
      setWindows(computeWindows(b));
    } catch (e) {
      setError("Konnte ICS nicht laden (CORS/URL prüfen). Nutze alternativ das Textfeld unten.");
    } finally {
      setLoadingICS(false);
    }
  }

  function parseFromTextarea() {
    setError("");
    try {
      const events = parseICS(icsText);
      const b = buildBookedSet(events);
      setBookedSet(b);
      setWindows(computeWindows(b));
    } catch (e) {
      setError("Konnte ICS nicht parsen. Prüfe das Format (DTSTART/DTEND).");
    }
  }

  function handleSave() {
    if (!title || !bookingUrl || (!icsUrl && !icsText)) {
      setError("Titel, Buchungslink und Kalender sind erforderlich.");
      return;
    }
    const id = crypto.randomUUID();
    const payload: Listing = { id, title, location, persons, priceFrom, bookingUrl, icsUrl: icsUrl || undefined, bookedSet: bookedSet!, windows };
    addListing(payload);
    setTitle("");
    setPersons(2);
    setPriceFrom(0);
    setBookingUrl("");
    setIcsUrl("");
    setIcsText("");
    setBookedSet(null);
    setWindows([]);
  }

  function clearAll() {
    if (confirm("Alle gespeicherten Unterkünfte wirklich löschen?")) {
      setListings([]);
      localStorage.removeItem("foehrfrei_listings");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="border rounded-lg bg-white">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Unterkunft hinzufügen</div>
          </div>
          <div className="p-4 space-y-4">
            {error && (
              <div className="p-3 text-sm border border-red-300 bg-red-50 rounded">{error}</div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Titel</label>
                <input className="mt-1 w-full border rounded px-2 py-1" placeholder="z. B. Haus MOIN – OG‑Whg" value={title} onChange={(e)=>setTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Ort</label>
                <select className="mt-1 w-full border rounded px-2 py-1" value={location} onChange={(e)=>setLocation(e.target.value)}>
                  {VILLAGES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Max. Personen</label>
                <input type="number" min={1} max={12} className="mt-1 w-full border rounded px-2 py-1" value={persons} onChange={(e)=>setPersons(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-sm font-medium">Preis ab (€/Nacht)</label>
                <input type="number" min={0} className="mt-1 w-full border rounded px-2 py-1" value={priceFrom} onChange={(e)=>setPriceFrom(Number(e.target.value))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Buchungs-/Kontaktlink</label>
                <input className="mt-1 w-full border rounded px-2 py-1" placeholder="https://… (eigene Website, Airbnb, Booking, WhatsApp)" value={bookingUrl} onChange={(e)=>setBookingUrl(e.target.value)} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Kalender-URL (ICS)</label>
                <div className="flex gap-2">
                  <input className="mt-1 w-full border rounded px-2 py-1" placeholder="https://…/calendar.ics" value={icsUrl} onChange={(e)=>setIcsUrl(e.target.value)} />
                  <button className="px-3 py-2 rounded border" onClick={fetchICS} disabled={!icsUrl || loadingICS}>{loadingICS ? "Laden…" : "Laden"}</button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Tipp: In Airbnb/Booking die Kalenderfreigabe (iCal/ICS) aktivieren.</p>
              </div>
              <div>
                <label className="block text-sm font-medium">Oder Kalender-Inhalt einfügen (ICS)</label>
                <textarea rows={6} className="mt-1 w-full border rounded px-2 py-1" placeholder="BEGIN:VCALENDAR…" value={icsText} onChange={(e)=>setIcsText(e.target.value)} />
                <div className="mt-2 flex gap-2">
                  <button className="px-3 py-2 rounded border" onClick={parseFromTextarea}>Parsen</button>
                  <button className="px-3 py-2 rounded border" onClick={resetPreview}>Zurücksetzen</button>
                </div>
              </div>
            </div>

            {bookedSet && (
              <div className="space-y-3">
                <h4 className="font-semibold">Vorschau: Verfügbarkeit (30 Tage)</h4>
                <CalendarPreview bookedSet={bookedSet} />
                <div className="flex items-center gap-2">
                  <button className="px-3 py-2 rounded bg-slate-900 text-white" onClick={handleSave}>Unterkunft speichern</button>
                  <button className="px-3 py-2 rounded border" onClick={resetPreview}>Neu prüfen</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border rounded-lg bg-white">
          <div className="p-4 border-b">
            <div className="text-lg font-semibold">Gespeicherte Unterkünfte</div>
          </div>
          <div className="p-4 space-y-3">
            {listings.length === 0 && (
              <p className="text-sm text-slate-500">Noch nichts gespeichert. Demo-Daten laden oder erste Unterkunft hinzufügen.</p>
            )}
            {listings.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <div className="font-medium">{l.title}</div>
                  <div className="text-xs text-slate-500">{l.location} · ab {l.priceFrom || "—"} €</div>
                </div>
                <button className="px-3 py-2 rounded border" onClick={()=>{
                  if (confirm("Unterkunft löschen?")) {
                    const next = listings.filter(x=>x.id!==l.id);
                    localStorage.setItem("foehrfrei_listings", JSON.stringify(next.map(n=>({...n, bookedSet:Array.from(n.bookedSet)}))));
                    location.reload();
                  }
                }}>Löschen</button>
              </div>
            ))}
            {listings.length > 0 && (
              <button className="px-3 py-2 rounded border" onClick={()=>{
                if (confirm("Alle gespeicherten Unterkünfte wirklich löschen?")) {
                  localStorage.removeItem("foehrfrei_listings");
                  location.reload();
                }
              }}>Alle löschen</button>
            )}
          </div>
        </div>

        <button className="px-3 py-2 rounded border" onClick={()=>loadDemo(setListings)}>Demo-Daten laden</button>
      </div>
    </div>
  );
}

function makeDemoICS(bookedRanges:[number, number][]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FoehrFrei Demo//DE",
  ];
  const start0 = todayAtMidnight();
  const ymd = (d:Date) => `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;
  for (const [a,b] of bookedRanges) {
    const start = addDays(start0, a);
    const end = addDays(start0, b);
    lines.push("BEGIN:VEVENT");
    lines.push(`DTSTART;VALUE=DATE:${ymd(start)}`);
    lines.push(`DTEND;VALUE=DATE:${ymd(end)}`);
    lines.push("SUMMARY:Gebucht");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\\r\\n");
}

function loadDemo(setListings:(l:Listing[])=>void) {
  const demo1ICS = makeDemoICS([[2,5],[10,12],[18,22]]);
  const demo2ICS = makeDemoICS([[1,2],[6,9],[15,16],[25,27]]);

  const l1Events = parseICS(demo1ICS);
  const l1Booked = buildBookedSet(l1Events);
  const l1Windows = computeWindows(l1Booked);

  const l2Events = parseICS(demo2ICS);
  const l2Booked = buildBookedSet(l2Events);
  const l2Windows = computeWindows(l2Booked);

  const demoListings: Listing[] = [
    {
      id: crypto.randomUUID(),
      title: "Strandnahes Apartment – Südstrand",
      location: "Wyk",
      persons: 3,
      priceFrom: 89,
      bookingUrl: "https://example.com/wyk-apartment",
      bookedSet: l1Booked,
      windows: l1Windows,
    },
    {
      id: crypto.randomUUID(),
      title: "Reetdach-Häuschen – Ruhig & gemütlich",
      location: "Nieblum",
      persons: 4,
      priceFrom: 129,
      bookingUrl: "https://example.com/nieblum-haus",
      bookedSet: l2Booked,
      windows: l2Windows,
    }
  ];

  setListings(demoListings);
  const serializable = demoListings.map(l => ({...l, bookedSet: Array.from(l.bookedSet)}));
  localStorage.setItem("foehrfrei_listings", JSON.stringify(serializable));
}
