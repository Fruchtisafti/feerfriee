// app/api/ics/parse/route.ts
import { NextRequest, NextResponse } from 'next/server';

function normalizeICS(icsText: string) {
  return icsText.replace(/\r?\n[ \t]/g, '');
}
function parseICSDate(val: string) {
  try {
    if (/^\d{8}$/.test(val)) {
      const y = +val.slice(0, 4), m = +val.slice(4, 6) - 1, d = +val.slice(6, 8);
      const dt = new Date(y, m, d);
      dt.setHours(0, 0, 0, 0);
      return dt;
    }
    if (/^\d{8}T\d{6}Z$/.test(val)) {
      // 20240101T120000Z -> ISO
      return new Date(
        val.replace(
          /^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/,
          '$1-$2-$3T$4:$5:$6Z'
        )
      );
    }
    if (/^\d{8}T\d{6}$/.test(val)) {
      const y = +val.slice(0, 4),
        m = +val.slice(4, 6) - 1,
        d = +val.slice(6, 8),
        hh = +val.slice(9, 11),
        mm = +val.slice(11, 13),
        ss = +val.slice(13, 15);
      return new Date(y, m, d, hh, mm, ss);
    }
    return new Date(val);
  } catch {
    return null as any;
  }
}
type Ev = { start: Date; end: Date };
function parseICS(icsText: string): Ev[] {
  const text = normalizeICS(icsText);
  const events: Ev[] = [];
  const parts = text.split(/BEGIN:VEVENT/).slice(1).map(b => 'BEGIN:VEVENT' + b);
  for (const block of parts) {
    const a = block.match(/DTSTART[^:]*:([^\r\n]+)/);
    const b = block.match(/DTEND[^:]*:([^\r\n]+)/);
    if (!a || !b) continue;
    const start = parseICSDate(a[1]);
    const end = parseICSDate(b[1]);
    if (start && end && end > start) events.push({ start, end });
  }
  return events;
}

function todayAtMidnight() { const d=new Date(); d.setHours(0,0,0,0); return d; }
function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function fmtYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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
function buildBookedSet(events: Ev[], horizonDays = 30) {
  const start = todayAtMidnight();
  const end = addDays(start, horizonDays);
  const booked = new Set<string>();
  for (const ev of events) {
    const s = ev.start < start ? start : ev.start;
    const e = ev.end > end ? end : ev.end;
    if (e <= start || s >= end) continue;
    for (const d of rangeDays(s, e)) booked.add(fmtYMD(d));
  }
  return booked;
}
function computeWindows(booked: Set<string>, horizonDays = 30) {
  const start = todayAtMidnight();
  const days = Array.from({ length: horizonDays }, (_, i) => addDays(start, i));
  const windows: { start: string; length: number }[] = [];
  let cur: null | { start: Date; length: number } = null;
  for (const d of days) {
    const ymd = fmtYMD(d);
    const free = !booked.has(ymd);
    if (free) {
      if (!cur) cur = { start: new Date(d), length: 1 };
      else cur.length += 1;
    } else if (cur) {
      windows.push({ start: fmtYMD(cur.start), length: cur.length });
      cur = null;
    }
  }
  if (cur) windows.push({ start: fmtYMD(cur.start), length: cur.length });
  return windows;
}

export async function POST(req: NextRequest) {
  try {
    const { icsUrl, icsText, horizonDays = 30 } = await req.json();

    if (!icsUrl && !icsText) {
      return NextResponse.json(
        { ok: false, error: 'Bitte ICS‑URL oder ICS‑Text angeben.' },
        { status: 400 }
      );
    }

    let raw = icsText as string | undefined;
    if (!raw && icsUrl) {
      const r = await fetch(icsUrl, { redirect: 'follow' });
      if (!r.ok) {
        return NextResponse.json(
          { ok: false, error: `ICS konnte nicht geladen werden (${r.status}).` },
          { status: 502 }
        );
      }
      raw = await r.text();
    }

    const events = parseICS(raw!);
    const booked = buildBookedSet(events, horizonDays);
    const windows = computeWindows(booked, horizonDays);

    return NextResponse.json({
      ok: true,
      horizonDays,
      bookedDays: Array.from(booked),
      windows, // [{start:'YYYY-MM-DD', length:n}]
      countEvents: events.length,
    });
  } catch (err: any) {
    console.error('ICS parse error', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Unbekannter Fehler beim ICS‑Import.' },
      { status: 500 }
    );
  }
}
