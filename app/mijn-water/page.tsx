import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { WaterLookup } from "./water-lookup";

export const metadata: Metadata = { title: "Waar komt mijn water vandaan?" };

export default function WaterPage() {
  return (
    <>
      <Intro section="Platform" title="Waar komt mijn water vandaan?">
        <p>Zoek op gemeente, district of postcode. Je krijgt de herkomst op het niveau van het leveringsgebied.</p>
      </Intro>
      <WaterLookup />
      <section className="section-space" aria-labelledby="water-route">
        <h2 id="water-route">Van bron tot kraan</h2>
        <ol className="card-grid route-list">
          <li className="panel"><h3>Van grond of rivier</h3><p>Drinkwaterbedrijven gebruiken grondwater of oppervlaktewater, afhankelijk van de regio.</p></li>
          <li className="panel"><h3>Zuivering en levering</h3><p>Het waterbedrijf zuivert en controleert het water tijdens de productie en distributie.</p></li>
          <li className="panel"><h3>In jouw gebouw</h3><p>Ook materialen en toestellen in de binneninstallatie kunnen invloed hebben op het water uit je eigen kraan.</p></li>
        </ol>
      </section>
    </>
  );
}
