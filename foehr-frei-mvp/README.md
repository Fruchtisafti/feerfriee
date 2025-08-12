# Föhr Frei – MVP

Hyperlokale Last‑Minute-Unterkünfte für Föhr (MVP). Kein Payment, nur Verfügbarkeiten + Link zum Anbieter.

## Lokal starten

```bash
npm install
npm run dev
# öffne http://localhost:3000
```

## Vercel-Deploy (empfohlen)

1. Repository auf GitHub/GitLab/Bitbucket pushen.
2. Auf https://vercel.com > **New Project** > Repo importieren.
3. Framework wird automatisch erkannt (**Next.js**). Build/Output:
   - Build Command: `next build`
   - Output Directory: `.vercel/output` (automatisch)
4. Deploy. Du erhältst eine Test-URL.
5. Eigene Domain (z. B. `foehrfrei.de`) in Vercel hinzufügen und auf das Projekt zeigen.

## Nutzung

- **Für Gäste**: Filter setzen → es werden Unterkünfte mit passendem freien Fenster angezeigt.
- **Für Vermieter**: Titel/Ort/Preis/Link angeben und **Kalender (ICS)** einfügen oder laden. Vorschau checken → **Speichern**.
- **Demo laden**: Füllt zwei Beispiel-Unterkünfte.

## Hinweise

- ICS von Airbnb/Booking kann CORS-geschützt sein. In dem Fall den **Kalender-Inhalt** (ICS) kopieren und in das Textfeld einfügen.
- Daten werden derzeit im **localStorage** gespeichert (MVP). Für echten Betrieb später Supabase (Postgres) anbinden.
- DSGVO/Impressum bitte ergänzen, sobald live.

## Nächste Schritte (optional)

- Supabase-Tabellen (`listings`, `availability_windows`) + Admin-Auth
- Kartenansicht (OpenStreetMap)
- Bilder-Upload pro Objekt
- „Boost“ (Top-Listing) als Einnahmeoption
