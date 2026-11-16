import type { Metadata } from "next";
import { Suspense } from "react";
import { Intro } from "../_components/content";
import { WaterMap } from "./water-map";
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
    </>
  );
}
