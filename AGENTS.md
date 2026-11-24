<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Projectafspraken van de gebruiker

- Werk lokaal op `http://localhost:3000`; wijk niet uit naar poort 3001. Het dev-script zet poort 3000 expliciet vast.
- Publiceer aangevraagde wijzigingen na de passende controles meteen via `main` op GitHub naar de bestaande Vercel-app: `https://from-tap-to-trust.vercel.app/`. De gebruiker heeft deze publicatiestap als vaste werkwijze toegestaan.
- Wacht op een geslaagde Vercel-deployment en controleer de publieke app voordat je meldt dat een wijziging live staat.
- De mascotte is op verzoek tijdelijk verborgen via `mascotteActief: false` in `inhoud.json`. Bewaar de animatiebestanden en zet haar pas weer aan als de gebruiker daarom vraagt.
