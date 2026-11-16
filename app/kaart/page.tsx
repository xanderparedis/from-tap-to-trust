import type { Metadata } from "next";
import { Suspense } from "react";
import { Intro } from "../_components/content";
import { WaterMap } from "./water-map";
import { sources } from "../_data/sources";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = { title: "Trusted by us" };

export default function MapPage() {
  return (
    <>
      <Intro section="Platform" title="Trusted by us">
        <p>Vind een plek om je drinkbus bij te vullen. Zoek in Antwerpen op wijk, straat, district of postcode.</p>
      </Intro>
      <Suspense fallback={<p className="panel" role="status">Kaart laden…</p>}>
        <WaterMap />
      </Suspense>
      <p className="source-note section-space">Locaties van <a href={sources.fountainData}>Stad Antwerpen</a>. De kaart geeft geregistreerde tappunten weer. Voor informatie over onderhoud of een defect raadpleeg je het <a href={sources.fountains}>stedelijk overzicht</a>.</p>
    </>
  );
}
