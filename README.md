# From Tap to Trust

## Zelf inhoud aanpassen

Open [inhoud.json](inhoud.json). Daar staan de teksten en kaarten van de **startpagina**, **Wat is nieuw?** en **Herkomst**. Pas de tekst tussen aanhalingstekens aan. Om een nieuwskaart toe te voegen, kopieer je in `watIsNieuw.kaarten` een kaart, zet je een komma tussen de kaarten en vul je een unieke titel en tekst in. Het blok `link` is optioneel.

Open de lokale versie om je aanpassing te bekijken:

```powershell
npm.cmd install
npm.cmd run dev
```

Ga naar [localhost:3000](http://localhost:3000). Als je wijziging naar `main` op GitHub is gepusht, publiceert Vercel ze automatisch.

## Bronnen en herkomst

De herkomstzoeker herkent Antwerpse plaatsnamen en postcodes en toont informatie voor de Antwerpse regio. Bronnen voor de waterwinning en de leverancierscontrole staan op de pagina **Bronnen**, bereikbaar via de linkbalk onderaan.
