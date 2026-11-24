# From Tap to Trust

## Zelf inhoud aanpassen

Open [inhoud.json](inhoud.json). Daar staan de teksten van **Start** en **Nieuwsbrief**. Kopieer een bericht in `nieuwsbrief.berichten` om een update, evenement of sponsor toe te voegen. Vul `rubriek`, een unieke `titel` en `tekst` in. Gebruik indien nodig een korte omschrijving in `beeldPlaceholder`. Voeg voor een echte foto `afbeelding` toe met `pad` en `alt`, zoals bij de mascottes. Een foto krijgt voorrang boven de placeholder. Voeg optioneel `link` toe met `adres` en `tekst`. Het label bij de plek voor de startvideo staat onder `start.videoPlaceholder`.

De mascotte is tijdelijk verborgen op de volledige website via `"mascotteActief": false` in `inhoud.json`. De animatie en interacties blijven bewaard. Zet die instelling pas op `true` wanneer de mascotte terug mag verschijnen. Onder `mascottes` zijn er drie beeldplekken: `start`, `nieuwsbrief` en `paginas`. Wanneer de mascotte actief is, verschijnt met `null` de interactieve watermascotte. Een eigen illustratie blijft mogelijk: plaats die in `public/brand` en vervang `null` door bijvoorbeeld `{"pad": "/brand/mascotte.webp", "alt": "Beschrijving van de mascotte"}`.

De watermascotte volgt de muis, reageert op aaien, klikken en ingedrukt houden en begint na twaalf seconden zonder interactie in te dommelen. Rond twintig seconden slaapt hij; een muisbeweging in de buurt, aanraking of toetsenbordactie maakt hem wakker. Twee vlotte muiscirkels maken hem tijdelijk duizelig. Vijf snelle klikjes geven hartjesogen; dubbelklikken op een bubbel maakt hem kort boos. Aaien stelt hem sneller gerust. De mascotte heeft geen achtergrond of losse bedieningsknoppen. Met toetsenbordfocus op de mascotte laten Enter en spatie hem springen; `b` activeert de boze reactie. De animatie respecteert verminderde beweging en stopt wanneer de mascotte buiten beeld of het tabblad verborgen is.

Pas de drinkflessen aan onder `webshop.producten`. Vul `prijs` in euro in en voeg een besteladres toe bij `bestelLink` zodra de verkoop start. Via `afbeelding` vervang je de productplaceholder.

Open de lokale versie om je aanpassing te bekijken:

```powershell
npm.cmd install
npm.cmd run dev
```

Ga naar [localhost:3000](http://localhost:3000). Als je wijziging naar `main` op GitHub is gepusht, publiceert Vercel ze automatisch.

Werkafspraak: blijf lokaal altijd op poort 3000 werken en publiceer aangevraagde wijzigingen na controle meteen naar de bestaande Vercel-app via `main`. Controleer vervolgens dat de Vercel-deployment geslaagd is en de wijziging live zichtbaar is.

Deze versie is gebouwd en gecontroleerd met Node.js 24. Voer `npm run lint`, `npm run test:mascot` en `npm run build` uit om code, mascottegedrag en productiebuild te controleren.

## Bronnen en herkomst

De herkomstzoeker toont de gecontroleerde drinkwaterbedrijven voor Antwerpen en zijn districten, Mortsel, Edegem, Schoten en Brasschaat. De koppelingen staan in app/mijn-water/water-companies.ts. De interactieve waterreis staat in app/mijn-water/water-journey.tsx. Bronnen voor de waterwinning en leverancierscontrole staan op de pagina **Bronnen**, bereikbaar via de linkbalk onderaan.
