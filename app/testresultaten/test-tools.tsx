"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

export function ChlorineDemo() {
  const [kind, setKind] = useState("Vrij chloor");
  const [value, setValue] = useState("0.20");
  const [experience, setExperience] = useState("Lichte chloorgeur");
  const [result, setResult] = useState<{ kind: string; value: number; experience: string }>();
  const number = Number(value);

  function showResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim() && Number.isFinite(number) && number >= 0) {
      setResult({ kind, value: number, experience });
    }
  }

  return (
    <div className="panel">
      <h3>Voorbeeldresultaat</h3>
      <p>Probeer met fictieve waarden. Invoer blijft op dit scherm en wordt nergens opgeslagen.</p>
      <form className="test-form" onSubmit={showResult}>
        <label className="field"><span>Wat is gemeten?</span>
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            <option>Vrij chloor</option>
            <option>Totaal chloor</option>
          </select>
        </label>
        <label className="field"><span>Meetwaarde (mg/L)</span>
          <input type="number" step="any" min="0" required value={value} onChange={(event) => setValue(event.target.value)} />
        </label>
        <label className="field field-wide"><span>Smaak- of geurervaring</span>
          <select value={experience} onChange={(event) => setExperience(event.target.value)}>
            <option>Lichte chloorgeur</option>
            <option>Duidelijke chloorgeur</option>
            <option>Geen chloorgeur gemerkt</option>
            <option>Andere smaak of geur</option>
          </select>
        </label>
        <button className="button field-wide" type="submit">Bekijk de voorbeelduitslag</button>
      </form>
      <div aria-live="polite">
        {result && (
          <div className="result-panel">
            <p><strong>{result.kind}: {new Intl.NumberFormat("nl-BE", { maximumSignificantDigits: 12 }).format(result.value)} mg/L</strong></p>
            <p>Je ervaring: {result.experience.toLowerCase()}.</p>
            <p>Deze demonstratie toont één parameter. Aan de hand van een chloormeting alleen kun je de drinkbaarheid van water niet beoordelen.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const checks = [
  ["known", "Ik weet of vermoed dat er loden leidingen of onderdelen aanwezig zijn."],
  ["unsure", "Ik weet niet uit welk materiaal de leidingen of de aansluiting bestaan."],
  ["none", "Ik ken geen aanwijzingen voor lood in mijn installatie."],
] as const;

export function LeadCheck() {
  const [answer, setAnswer] = useState<(typeof checks)[number][0] | "">("");
  const [result, setResult] = useState<typeof answer>("");

  return (
    <div className="panel">
      <form className="lead-form" onSubmit={(event) => { event.preventDefault(); setResult(answer); }}>
        <fieldset>
          <legend>Zelfcheck: wat weet je over je leidingen?</legend>
          <p className="lead-hint">Een grijze, niet-magnetische buis kan een aanwijzing zijn. Veel leidingen zitten achter muren of vloeren. Kies wat je over jouw installatie weet.</p>
          {checks.map(([value, label]) => (
            <label key={value} className="radio-field">
              <input type="radio" name="lead" value={value} checked={answer === value}
                onChange={() => { setAnswer(value); setResult(""); }} required />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <button className="button" type="submit">Bekijk mijn volgende stap</button>
      </form>
      <div aria-live="polite">
        {result && (
          <div className="result-panel">
            <h3>{result === "none" ? "Volgens je antwoord zijn er geen bekende aanwijzingen" : "Laat je situatie professioneel nakijken"}</h3>
            <p>{result === "none"
              ? "Op basis van een zelfcheck kan lood niet worden uitgesloten. Blijft er twijfel, bespreek dan een staalname met je waterbedrijf."
              : "Vraag je waterbedrijf om advies over de aansluiting en een professionele loodtest. Laat bij twijfel over de binnenleidingen een vakpersoon meekijken."}</p>
            <Link className="text-link" href="/contact#water-test">Vraag naar een loodtest <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </div>
    </div>
  );
}
