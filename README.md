# From Tap to Trust

## Zelf inhoud aanpassen

Open [inhoud.json](inhoud.json). Daar staan de teksten van **Start** en **Nieuwsbrief**. Kopieer een bericht in `nieuwsbrief.berichten` om een update, evenement of sponsor toe te voegen. Vul `rubriek`, een unieke `titel` en `tekst` in. Gebruik indien nodig een korte omschrijving in `beeldPlaceholder`. Voeg voor een echte foto `afbeelding` toe met `pad` en `alt`, zoals bij de mascottes. Een foto krijgt voorrang boven de placeholder. Voeg optioneel `link` toe met `adres` en `tekst`. Het label bij de plek voor de startvideo staat onder `start.videoPlaceholder`.

Onder `mascottes` zijn er drie beeldplekken: `start`, `nieuwsbrief` en `paginas`. Plaats een illustratie in `public/brand` en vervang `null` door bijvoorbeeld `{"pad": "/brand/mascotte.webp", "alt": "Beschrijving van de mascotte"}`.

Pas de drinkflessen aan onder `webshop.producten`. Vul `prijs` in euro in en voeg een besteladres toe bij `bestelLink` zodra de verkoop start. Via `afbeelding` vervang je de productplaceholder.

Open de lokale versie om je aanpassing te bekijken:

```powershell
npm.cmd install
npm.cmd run dev
```

Ga naar [localhost:3000](http://localhost:3000). Als je wijziging naar `main` op GitHub is gepusht, publiceert Vercel ze automatisch.

## Bronnen en herkomst

De herkomstzoeker toont de gecontroleerde drinkwaterbedrijven voor Antwerpen en zijn districten, Mortsel, Edegem, Schoten en Brasschaat. De koppelingen staan in app/mijn-water/water-companies.ts. De interactieve waterreis staat in app/mijn-water/water-journey.tsx. Bronnen voor de waterwinning en leverancierscontrole staan op de pagina **Bronnen**, bereikbaar via de linkbalk onderaan.
