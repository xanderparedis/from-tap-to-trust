"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import fountains from "../_data/antwerp-fountains.json";
import { antwerpNeighborhoods } from "../_data/antwerp-neighborhoods";
import { sources } from "../_data/sources";

const antwerpNames = new Set(["antwerpen", "antwerp", "berendrecht", "zandvliet", "lillo", ...fountains.map((point) => point.district.toLowerCase())]);
const antwerpPostcodes = new Set(["2000", "2018", "2020", "2030", "2040", "2050", "2060", "2100", "2140", "2170", "2180", "2600", "2610", "2660"]);

export function WaterLookup() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const antwerp = antwerpNames.has(query.toLowerCase()) || antwerpNeighborhoods.has(query.toLowerCase()) || antwerpPostcodes.has(query);

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
            {antwerp ? (
              <>
                <h3>Water-link · regio Antwerpen</h3>
                <p>Water-link gebruikt oppervlaktewater voor dit leveringsgebied. Het stroomgebiedbeheerplan noemt het Albertkanaal bij Oelegem en het Netekanaal bij Walem. Je postcode geeft regionale context. Vraag je leverancier om informatie voor jouw aansluiting.</p>
                <div className="actions">
                  <Link className="text-link" href={"/kaart?plaats=" + encodeURIComponent(query)}>Bekijk tappunten in de buurt <span aria-hidden="true">↗</span></Link>
                </div>
              </>
            ) : (
              <>
                <h3>Zoek {query} bij AquaFlanders</h3>
                <p>De eerste versie toont regionale gegevens voor Stad Antwerpen. Gebruik de officiële zoekfunctie om je waterbedrijf in andere Vlaamse gemeenten te vinden.</p>
              </>
            )}
          </div>
        )}
        <a className="text-link" href={sources.waterCompany}>Officiële postcodezoeker van AquaFlanders <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
