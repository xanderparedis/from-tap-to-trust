import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { WaterLookup } from "./water-lookup";

export const metadata: Metadata = { title: "Waar komt mijn water vandaan?" };

export default function WaterPage() {
  return (
    <>
      <Intro section="Herkomst" title="Van bron tot jouw kraan.">
        <p>Ontdek je waterbedrijf en volg de reis van het Antwerpse drinkwater.</p>
      </Intro>
      <WaterLookup />
    </>
  );
}
