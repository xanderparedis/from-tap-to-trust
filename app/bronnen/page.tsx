import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { sources } from "../_data/sources";

export const metadata: Metadata = { title: "Bronnen" };

const references = [
  {
    title: "Herkomst en waterkwaliteit",
    links: [
      ["AquaFlanders – Kwaliteit van mijn drinkwater", sources.waterQuality],
      ["AquaFlanders – Zoek je waterbedrijf", sources.waterCompany],
      ["AquaFlanders – Waterbedrijf voor Antwerpen", sources.antwerpWaterCompany],
      ["AquaFlanders – Waterbedrijf voor Borsbeek", sources.borsbeek],
      ["AquaFlanders – Waterbedrijf voor Mortsel", sources.mortsel],
      ["AquaFlanders – Waterbedrijf voor Edegem", sources.edegem],
      ["AquaFlanders – Waterbedrijf voor Schoten", sources.schoten],
      ["AquaFlanders – Waterbedrijf voor Brasschaat", sources.brasschaat],
      ["Stroomgebiedbeheerplannen – Drinkwaterproductie in het Netebekken", sources.antwerpWater],
      ["Stroomgebiedbeheerplannen – De Maas als bron voor Antwerpen", sources.antwerpWaterOrigin],
      ["VMM – Drinkwaterkwaliteit per leveringsgebied", sources.distributionQuality],
    ],
  },
  {
    title: "Waterproblemen en thuistests",
    links: [
      ["VMM – Leidingen en toestellen in je gebouw", sources.waterInstallation],
      ["VMM – Loden leidingen herkennen en vervangen", sources.lead],
      ["Vlaanderen – Loden waterleidingen in huur- en eigendomswoningen", sources.leadHousing],
      ["Health Canada – Vrij, totaal en gebonden chloor", sources.chlorine],
      ["De Watergroep – Drinkwaterkwaliteit en smaaktips", sources.taste],
      ["AquaFlanders – Contact met je waterbedrijf", sources.waterContact],
    ],
  },
  {
    title: "Kaart en openbare tappunten",
    links: [
      ["Stad Antwerpen – Dataset drinkwaterfonteinen", sources.fountainData],
      ["Stad Antwerpen – Overzicht en meldingen", sources.fountains],
      ["OpenStreetMap – Kaartgegevens en licentie", "https://www.openstreetmap.org/copyright"],
    ],
  },
] as const;

export default function SourcesPage() {
  return (
    <>
      <Intro section="From Tap to Trust" title="Bronnen">
        <p>Hier vind je de achtergrondinformatie en kaartgegevens die we op het platform gebruiken.</p>
      </Intro>
      <div className="card-grid section-space">
        {references.map(({ title, links }) => (
          <details className="panel" key={title}>
            <summary>{title}</summary>
            <ul>
              {links.map(([label, href]) => (
                <li key={href}><a className="text-link" href={href}>{label} <span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <section className="panel section-space">
        <h2>Eigen onderzoek</h2>
        <p>De samenvatting van onze enquêtes en straatgesprekken is gebaseerd op het academisch projectrapport <cite>From Tap to Trust</cite>, versie 1.4, pp. 27–30.</p>
      </section>
    </>
  );
}
