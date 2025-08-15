// app/api/deals/route.ts
export const revalidate = 600; // 10 Min. Cache

type IcsEvent = { start: Date; end: Date };
type Deal = {
  id: string;
  title: string;
  location: string;
  priceFrom: number;
  bookingUrl: string;
  nextWindow?: { start: string; length: number };
};

// ---------- Helpers ----------
function todayAtMidnight() { const d=new Date(); d.setHours(0,0,0,0); return d; }
function addDays(date: Date, days: number) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function fmtYMD(date: Date) { const y=date.getFullYear(); const m=String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }
function rangeDays(start: Date, endExclusive: Date) { const out: Date[] = []; let d=new Date(start); while (d<endExclusive){ out.push(new Date(d)); d.setDate(d.getDate()+1);} return out; }
function normalizeICS(ics: string){ return ics.replace(/\r?\n[ \t]/g,''); }
function parseICSDate(val: string): Date | null {
  try{
    if(/^\d{8}$/.test(val)){ const y=+val.slice(0,4), m=+val.slice(4,6)-1, d=+val.slice(6,8); const dt=new Date(y,m,d); dt.setHours(0,0,0,0); return dt; }
    if(/^\d{8}T\d{6}Z$/.test(val)){ return new Date(val.replace(/^(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z$/,'$1-$2-$3T$4:$5:$6Z')); }
    if(/^\d{8}T\d{6}$/.test(val)){ const y=+val.slice(0,4), m=+val.slice(4,6)-1, d=+val.slice(6,8), hh=+val.slice(9,11), mm=+val.slice(11,13), ss=+val.slice(13,15); return new Date(y,m,d,hh,mm,ss); }
    return new Date(val);
  } catch { return null; }
}
function parseICS(ics: string): IcsEvent[] {
  const text=normalizeICS(ics); const events: IcsEvent[]=[];
  const parts = text.split(/BEGIN:VEVENT/).slice(1).map(b=>'BEGIN:VEVENT'+b);
  for(const block of parts){
    const a = block.match(/DTSTART[^:]*:([^\r\n]+)/);
    const b = block.match(/DTEND[^:]*:([^\r\n]+)/);
    if(!a||!b) continue;
    const start=parseICSDate(a[1]); const end=parseICSDate(b[1]);
    if(start && end && end>start) events.push({start,end});
  }
  return events;
}
function buildBookedSet(events:IcsEvent[], horizonDays=30){
  const start=todayAtMidnight(), end=addDays(start,horizonDays), booked=new Set<string>();
  for(const ev of events){
    const s=ev.start<start?start:ev.start, e=ev.end>end?end:ev.end;
    if(e<=start||s>=end) continue;
    for(const d of rangeDays(s,e)) booked.add(fmtYMD(d));
  }
  return booked;
}
function computeWindows(booked:Set<string>, horizonDays=30){
  const start=todayAtMidnight(); const days=Array.from({length:horizonDays},(_,i)=>addDays(start,i));
  const wins:{start:Date;length:number}[]=[]; let cur:null|{start:Date;length:number}=null;
  for(const d of days){ const ymd=fmtYMD(d); const free=!booked.has(ymd);
    if(free){ if(!cur) cur={start:new Date(d),length:1}; else cur.length+=1; }
    else if(cur){ wins.push(cur); cur=null; }
  }
  if(cur) wins.push(cur);
  return wins;
}
function makeDemoICS(ranges:[number,number][]) {
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FoehrFrei Demo//DE'];
  const start0=todayAtMidnight();
  const ymd=(d:Date)=>`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  for(const [a,b] of ranges){
    const s=addDays(start0,a), e=addDays(start0,b);
    lines.push('BEGIN:VEVENT', `DTSTART;VALUE=DATE:${ymd(s)}`, `DTEND;VALUE=DATE:${ymd(e)}`, 'SUMMARY:Gebucht', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

// ---------- GET ----------
export async function GET() {
  // Demo-Daten (hier kannst du später echte ICS-URLs hinterlegen)
  const feeds = [
    {
      id: 'wyk-apartment',
      title: 'Strandnahes Apartment – Südstrand',
      location: 'Wyk auf Föhr',
      priceFrom: 89,
      bookingUrl: 'https://example.com/wyk-apartment',
      icsText: makeDemoICS([[2,5],[10,12],[18,22]]),
    },
    {
      id: 'nieblum-reet',
      title: 'Reetdach-Häuschen – Ruhig & gemütlich',
      location: 'Nieblum',
      priceFrom: 129,
      bookingUrl: 'https://example.com/nieblum-haus',
      icsText: makeDemoICS([[1,2],[6,9],[15,16],[25,27]]),
    },
  ];

  const horizonDays = 30;
  const minNights = 3;

  const deals: Deal[] = feeds.map((f) => {
    const events = parseICS(f.icsText);
    const booked = buildBookedSet(events, horizonDays);
    const windows = computeWindows(booked, horizonDays);
    const next = windows.find(w => w.length >= minNights);
    return {
      id: f.id,
      title: f.title,
      location: f.location,
      priceFrom: f.priceFrom,
      bookingUrl: f.bookingUrl,
      nextWindow: next ? { start: fmtYMD(next.start), length: next.length } : undefined,
    };
  }).filter(d => d.nextWindow);

  return Response.json({ ok: true, horizonDays, minNights, deals });
}
