"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { sources } from "../_data/sources";
import { findWaterCompany } from "./water-companies";
import { WaterJourney } from "./water-journey";

export function WaterLookup() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const company = findWaterCompany(query);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery(input.trim());
  }

  return (
    <>
    <section className="panel lookup" aria-labelledby="lookup-title">
      <div className="lookup-heading">
        <div><p className="accent-label">Jouw buurt</p><h2 id="lookup-title">Wie levert je water?</h2></div>
        <p>Zoek in Antwerpen en de nabije gemeenten.</p>
      </div>
      <form className="lookup-form" onSubmit={search}>
        <label className="field">
          <span>Plaats of postcode</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Bijv. Borgerhout of 2140" required />
        </label>
        <button className="button" type="submit" disabled={!input.trim()}>Zoek mijn waterbedrijf</button>
      </form>
      <div className="lookup-result" aria-live="polite">
        {query && (
          <div key={query} className="lookup-answer motion-reveal">
            {company ? (
              <>
                <p>{company.postcode} {company.name}</p>
                <h3>{company.company}</h3>
                <p>Je drinkwaterbedrijf. Bekijk hieronder de regionale waterreis.</p>
                <div className="actions">
                  <a className="text-link" href="#waterwinning-antwerpen">Volg de waterreis <span aria-hidden="true">↓</span></a>
                  {company.waterJourney && <Link className="text-link" href={"/kaart?plaats=" + company.postcode}>Tappunten in de buurt <span aria-hidden="true">↗</span></Link>}
                </div>
              </>
            ) : (
              <>
                <h3>Deze plaats staat nog niet in onze zoeker</h3>
                <p>Zoek je waterbedrijf op via de officiële gemeentezoeker.</p>
                <a className="text-link" href={sources.waterCompany}>Zoek {query} bij AquaFlanders <span aria-hidden="true">↗</span></a>
              </>
            )}
          </div>
        )}
      </div>
      <details className="lookup-coverage">
        <summary>Welke plaatsen kan ik opzoeken?</summary>
        <p>Antwerpen en zijn districten, Mortsel, Edegem, Schoten en Brasschaat. Voor andere plaatsen kun je de officiële gemeentezoeker gebruiken.</p>
        <a className="text-link" href={sources.waterCompany}>Open de gemeentezoeker <span aria-hidden="true">↗</span></a>
      </details>
    </section>
    {(!query || company) && <WaterJourney key={company?.postcode ?? "default"} company={company?.company} location={company?.name} />}
    </>
  );
}
