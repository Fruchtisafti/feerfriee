import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const { name, email, message, company } = await req.json();

    // Honeypot (Bot-Falle)
    if (company) {
      return new Response(null, { status: 204 });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Fehlende Angaben.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const to = process.env.RESEND_TEST_TO || email; // Sandbox liefert an verifizierte Empfänger

    await resend.emails.send({
      from: 'Föhr Frei <onboarding@resend.dev>',
      to: [to],
      subject: 'Neue Anfrage über Föhr Frei',
      reply_to: email,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'E-Mail-Versand fehlgeschlagen.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
