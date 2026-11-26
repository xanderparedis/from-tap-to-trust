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
        <p>{"Find somewhere to refill your bottle. Search Antwerp by neighbourhood, street, district or postcode."}</p>
      </Intro>
      <Suspense fallback={<p className="panel" role="status">{"Loading map…"}</p>}>
        <WaterMap />
      </Suspense>
    </>
  );
}
