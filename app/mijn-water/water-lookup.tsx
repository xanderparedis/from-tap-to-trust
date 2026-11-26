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
        <div><p className="accent-label">{"Your neighbourhood"}</p><h2 id="lookup-title">{"Who supplies your water?"}</h2></div>
        <p>{"Search Antwerp and nearby municipalities."}</p>
      </div>
      <form className="lookup-form" onSubmit={search}>
        <label className="field">
          <span>{"Place or postcode"}</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={"E.g. Borgerhout or 2140"} required />
        </label>
        <button className="button" type="submit" disabled={!input.trim()}>{"Find my water company"}</button>
      </form>
      <div className="lookup-result" aria-live="polite">
        {query && (
          <div key={query} className="lookup-answer motion-reveal">
            {company ? (
              <>
                <p>{company.postcode} {company.name}</p>
                <h3>{company.company}</h3>
                <p>{"Your drinking water company. Explore the regional water journey below."}</p>
                <div className="actions">
                  <a className="text-link" href="#waterwinning-antwerpen">{"Follow the water journey "}<span aria-hidden="true">↓</span></a>
                  {company.waterJourney && <Link className="text-link" href={"/kaart?plaats=" + company.postcode}>{"Nearby refill points "}<span aria-hidden="true">↗</span></Link>}
                </div>
              </>
            ) : (
              <>
                <h3>{"This place is not in our search yet"}</h3>
                <p>{"Find your water company using the official municipality search."}</p>
                <a className="text-link" href={sources.waterCompany}>{"Find "}{query}{" at AquaFlanders "}<span aria-hidden="true">↗</span></a>
              </>
            )}
          </div>
        )}
      </div>
      <details className="lookup-coverage">
        <summary>{"Which places can I search for?"}</summary>
        <p>{"Antwerp and its districts, Mortsel, Edegem, Schoten and Brasschaat. For other places, use the official municipality search."}</p>
        <a className="text-link" href={sources.waterCompany}>{"Open the municipality search "}<span aria-hidden="true">↗</span></a>
      </details>
    </section>
    {(!query || company) && <WaterJourney key={company?.postcode ?? "default"} company={company?.company} location={company?.name} />}
    </>
  );
}
