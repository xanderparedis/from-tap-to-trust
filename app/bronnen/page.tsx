import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { sources } from "../_data/sources";

export const metadata: Metadata = { title: "Sources" };

const references = [
  {
    title: "Water sources and quality",
    links: [
      ["AquaFlanders – My drinking water quality", sources.waterQuality],
      ["AquaFlanders – Find your water company", sources.waterCompany],
      ["AquaFlanders – Water company for Antwerp", sources.antwerpWaterCompany],
      ["AquaFlanders – Water company for Borsbeek", sources.borsbeek],
      ["AquaFlanders – Water company for Mortsel", sources.mortsel],
      ["AquaFlanders – Water company for Edegem", sources.edegem],
      ["AquaFlanders – Water company for Schoten", sources.schoten],
      ["AquaFlanders – Water company for Brasschaat", sources.brasschaat],
      ["River basin management plans – Drinking water production in the Nete basin", sources.antwerpWater],
      ["River basin management plans – The Meuse as a source for Antwerp", sources.antwerpWaterOrigin],
      ["VMM – Drinking water quality by supply area", sources.distributionQuality],
    ],
  },
  {
    title: "Water issues and home tests",
    links: [
      ["VMM – Pipes and appliances in your building", sources.waterInstallation],
      ["VMM – Identifying and replacing lead pipes", sources.lead],
      ["Flanders – Lead water pipes in rented and owner-occupied homes", sources.leadHousing],
      ["Health Canada – Free, total and combined chlorine", sources.chlorine],
      ["De Watergroep – Drinking water quality and taste tips", sources.taste],
      ["AquaFlanders – Contact your water company", sources.waterContact],
    ],
  },
  {
    title: "Map and public refill points",
    links: [
      ["City of Antwerp – Drinking water fountain dataset", sources.fountainData],
      ["City of Antwerp – Overview and reporting", sources.fountains],
      ["OpenStreetMap – Map data and licence", "https://www.openstreetmap.org/copyright"],
    ],
  },
] as const;

export default function SourcesPage() {
  return (
    <>
      <Intro section="From Tap to Trust" title={"Sources"}>
        <p>{"Find the background information and map data used on this platform here."}</p>
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
        <h2>{"Frequently asked questions"}</h2>
        <p>{"The questions and answers are based on the project document "}<cite>{"Frequently asked questions"}</cite>{", covering four themes: safety and quality, taste and smell, water at home and treatment, and choices and misconceptions. The quality figure of 99.56% refers to tap water analyses in Flanders in 2024."}</p>
      </section>
      <section className="panel section-space">
        <h2>{"Our research"}</h2>
        <p>{"The summary of our surveys and street interviews is based on the academic project report "}<cite>From Tap to Trust</cite>{", version 1.4, pp. 27–30."}</p>
      </section>
    </>
  );
}
