import { NextResponse } from 'next/server';

// Optional: Resend für E-Mails (https://resend.com)
let Resend: any = null;
try {
  // dynamisch importieren, damit Build ohne Key klappt
  // @ts-ignore
  Resend = (await import('resend')).Resend;
} catch {}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, objectName, calendarUrl, message } = body || {};

    if (!name || !email || !objectName) {
      return NextResponse.json({ ok: false, error: 'Missing fields' }, { status: 400 });
    }

    const textLines = [
      'Neue Vermieter‑Anfrage',
      '',
      `Name:        ${name}`,
      `E‑Mail:      ${email}`,
      `Objekt:      ${objectName}`,
      `Kalender:    ${calendarUrl || '—'}`,
      '',
      `Nachricht:`,
      (message || '—'),
      '',
      `Referer: ${request.headers.get('referer') || '—'}`,
      `UA:      ${request.headers.get('user-agent') || '—'}`,
    ].join('\n');

    // Wenn RESEND_API_KEY gesetzt ist → E‑Mail senden
    if (process.env.RESEND_API_KEY && Resend) {
      const resend = new Resend(process.env.RESEND_API_KEY);

      const from = process.env.RESEND_FROM || 'no-reply@your-domain.tld';
      const to = process.env.RESEND_TO || from;

      await resend.emails.send({
        from,
        to,
        subject: 'Föhr Frei – neue Vermieter‑Anfrage',
        text: textLines,
      });
    } else {
      // Fallback: einfach ins Log schreiben (sichtbar in Vercel → Functions/Logs)
      console.log('[lead-fallback]', textLines);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[lead-error]', e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}
