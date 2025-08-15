import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Fallbacks: mit Resend-Trial kannst du `onboarding@resend.dev` nutzen
const FROM = process.env.RESEND_FROM || 'Foehr Frei <onboarding@resend.dev>';
const TO = process.env.CONTACT_TO || process.env.RESEND_TO || '';

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { ok: false, error: 'RESEND_API_KEY fehlt.' },
        { status: 500 }
      );
    }
    if (!TO) {
      return NextResponse.json(
        { ok: false, error: 'CONTACT_TO (Empfänger) nicht gesetzt.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const { name = '', email = '', message = '', company = '', website = '', honeypot = '' } = body;

    // sehr simples Anti-Spam: verstecktes Feld muss leer sein
    if (honeypot) {
      return NextResponse.json({ ok: true }); // stillschweigend "ok"
    }

    // Validierung
    if (!name || name.length < 2) {
      return NextResponse.json({ ok: false, error: 'Name zu kurz.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'E-Mail ungültig.' }, { status: 400 });
    }
    if (!message || message.length < 5) {
      return NextResponse.json({ ok: false, error: 'Nachricht zu kurz.' }, { status: 400 });
    }

    const subject = `Kontaktanfrage – Föhr Frei (${name})`;
    const text = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      company ? `Firma: ${company}` : null,
      website ? `Website: ${website}` : null,
      '',
      'Nachricht:',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px">Neue Kontaktanfrage – Föhr Frei</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
           <strong>E-Mail:</strong> ${escapeHtml(email)}<br/>
           ${company ? `<strong>Firma:</strong> ${escapeHtml(company)}<br/>` : ''}
           ${website ? `<strong>Website:</strong> ${escapeHtml(website)}<br/>` : ''}
        </p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      subject,
      text,
      html,
      reply_to: email, // damit du direkt antworten kannst
    });

    if (error) {
      return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unbekannter Fehler' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
