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
      ["Stroomgebiedbeheerplannen – Drinkwater in de regio Antwerpen", sources.antwerpWater],
    ],
  },
  {
    title: "Waterproblemen en thuistests",
    links: [
      ["VMM – Leidingen en toestellen in je gebouw", sources.waterInstallation],
      ["VMM – Loden leidingen herkennen en vervangen", sources.lead],
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
          <section className="panel" key={title}>
            <h2>{title}</h2>
            <ul>
              {links.map(([label, href]) => (
                <li key={href}><a className="text-link" href={href}>{label} <span aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="panel section-space">
        <h2>Eigen onderzoek</h2>
        <p>De samenvatting van onze enquêtes en straatgesprekken is gebaseerd op het academisch projectrapport <cite>From Tap to Trust</cite>, versie 1.4, pp. 27–30.</p>
      </section>
    </>
  );
}
