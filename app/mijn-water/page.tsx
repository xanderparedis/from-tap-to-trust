import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { herkomst } from "../../inhoud.json";
import { WaterLookup } from "./water-lookup";

export const metadata: Metadata = { title: herkomst.titel };

export default function WaterPage() {
  const { antwerpen, route } = herkomst;

  return (
    <>
      <Intro section="Platform" title={herkomst.titel}>
        <p>{herkomst.intro}</p>
      </Intro>
      <WaterLookup antwerp={antwerpen} />
      <section className="section-space" id="waterwinning-antwerpen" aria-labelledby="antwerp-title">
        <div className="section-heading">
          <div>
            <h2 id="antwerp-title">{antwerpen.titel}</h2>
            <p>{antwerpen.intro}</p>
          </div>
        </div>
        <div className="feature-grid">
          {antwerpen.sites.map((site) => (
            <article className="panel" key={site.titel}>
              <h3>{site.titel}</h3>
              <p>{site.tekst}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-space" aria-labelledby="water-route">
        <h2 id="water-route">{route.titel}</h2>
        <ol className="card-grid route-list">
          {route.stappen.map((step) => (
            <li className="panel" key={step.titel}><h3>{step.titel}</h3><p>{step.tekst}</p></li>
          ))}
        </ol>
      </section>
    </>
  );
}
