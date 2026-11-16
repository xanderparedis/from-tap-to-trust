"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { antwerpNeighborhoods } from "../_data/antwerp-neighborhoods";
import { sources } from "../_data/sources";

const antwerpNames = new Set([
  "antwerpen", "antwerp", "berchem", "berendrecht", "berendrecht – zandvliet – lillo",
  "borgerhout", "borsbeek", "deurne", "ekeren", "hoboken", "lillo", "linkeroever",
  "merksem", "wilrijk", "zandvliet",
]);
const antwerpPostcodes = new Set([
  "2000", "2018", "2020", "2030", "2040", "2050", "2060", "2100", "2140",
  "2150", "2170", "2180", "2600", "2610", "2660",
]);

type AntwerpOrigin = {
  leverancier: string;
  brontype: string;
  oorsprong: string;
  schaal: string;
  onbekend: string;
};

export function WaterLookup({ antwerp }: { antwerp: AntwerpOrigin }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const place = query.toLowerCase().replace(/\s+/g, " ");
  const isAntwerp = antwerpNames.has(place) || antwerpNeighborhoods.has(place) || antwerpPostcodes.has(place);
  const mapQuery = place === "linkeroever" ? "2050" : query;

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input.trim());
  }

  return (
    <section className="panel lookup" aria-labelledby="lookup-title">
      <h2 id="lookup-title">Zoek jouw buurt of stad</h2>
      <form className="lookup-form" onSubmit={search}>
        <label className="field">
          <span>Plaats of postcode</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Bijv. Borgerhout of 2140" required />
        </label>
        <button className="button" type="submit" disabled={!input.trim()}>Zoeken</button>
      </form>
      <div className="lookup-result" aria-live="polite">
        {query && (
          <div key={query} className="motion-reveal">
            {isAntwerp ? (
              <>
                <h3>{antwerp.leverancier} · regio Antwerpen</h3>
                <dl className="origin-facts">
                  <div><dt>Type bron</dt><dd>{antwerp.brontype}</dd></div>
                  <div><dt>Oorsprong</dt><dd>{antwerp.oorsprong}</dd></div>
                </dl>
                <p>{antwerp.schaal}</p>
                <div className="actions">
                  <a className="text-link" href="#waterwinning-antwerpen">Bekijk de waterwinning <span aria-hidden="true">↓</span></a>
                  {place !== "borsbeek" && place !== "2150" && (
                    <Link className="text-link" href={"/kaart?plaats=" + encodeURIComponent(mapQuery)}>Bekijk tappunten in de buurt <span aria-hidden="true">↗</span></Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3>Zoek {query} bij AquaFlanders</h3>
                <p>{antwerp.onbekend}</p>
              </>
            )}
          </div>
        )}
        <a className="text-link" href={sources.waterCompany}>Officiële postcodezoeker van AquaFlanders <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
