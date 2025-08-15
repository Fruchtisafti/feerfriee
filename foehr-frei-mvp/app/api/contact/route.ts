// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// einfache HTML-Escapes, damit Nutzereingaben sicher gerendert werden
function esc(v: string) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Ungültiger Request-Body (kein JSON).' },
        { status: 400 }
      );
    }

    const { name, email, company, website, message } = body as {
      name?: string;
      email?: string;
      company?: string;
      website?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: 'Bitte Name, E‑Mail und Nachricht ausfüllen.' },
        { status: 400 }
      );
    }

    // Server-Konfiguration prüfen
    const FROM = process.env.RESEND_FROM;
    const TO = process.env.CONTACT_TO;
    if (!process.env.RESEND_API_KEY || !FROM || !TO) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'E-Mail-Versand ist serverseitig nicht konfiguriert (ENV fehlt).',
        },
        { status: 500 }
      );
    }

    const html = `
      <h2>Kontaktanfrage – Föhr Frei</h2>
      <p><strong>Name:</strong> ${esc(name)}</p>
      <p><strong>E-Mail:</strong> ${esc(email)}</p>
      ${company ? `<p><strong>Firma:</strong> ${esc(company)}</p>` : ''}
      ${website ? `<p><strong>Website:</strong> ${esc(website)}</p>` : ''}
      <p><strong>Nachricht:</strong></p>
      <pre style="font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space:pre-wrap;">${esc(
        message
      )}</pre>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      subject: `Föhr Frei – Kontakt von ${name}`,
      reply_to: email,
      html,
    });

    if (error) {
      // Resend liefert strukturierten Fehler – sauber ins Frontend weiterreichen
      return NextResponse.json(
        { ok: false, error: error.message ?? String(error) },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 200 });
  } catch (err: any) {
    console.error('API /contact error:', err);
    const msg =
      err?.message ?? (typeof err === 'string' ? err : 'Unbekannter Serverfehler');
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
