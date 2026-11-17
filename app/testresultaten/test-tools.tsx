"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const experiences = ["Geen chloorgeur gemerkt", "Lichte chloorgeur", "Duidelijke chloorgeur", "Andere smaak of geur"];
const impactOptions = [
  ["none", "Ik heb er geen last van"],
  ["some", "Ik heb er last van maar drink het nog"],
  ["avoid", "Ik vermijd kraanwater hierdoor"],
] as const;
const formatNumber = new Intl.NumberFormat("nl-BE", { maximumSignificantDigits: 12 });

type ChlorineResult = {
  free: number;
  total: number;
  experience: string;
  impact: string;
};

export function ChlorineDemo() {
  const [result, setResult] = useState<ChlorineResult>();
  const [error, setError] = useState("");

  function showResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const free = Number(data.get("free"));
    const total = Number(data.get("total"));

    if (!Number.isFinite(free) || !Number.isFinite(total) || free < 0 || total < free) {
      setError("In deze proef kan totaal chloor niet lager zijn dan vrij chloor. Kijk beide invoerwaarden na.");
      return;
    }

    setResult({ free, total, experience: String(data.get("experience")), impact: String(data.get("impact")) });
    setError("");
  }

  return (
    <div className="panel">
      <h3>Probeer een voorbeelduitslag</h3>
      <p>Vul fictieve waarden in om de uitslag te verkennen. De demo bewaart je invoer niet.</p>
      <form className="test-form" onSubmit={showResult} onChange={() => { setResult(undefined); setError(""); }}>
        <label className="field"><span>Vrij chloor (mg/L)</span>
          <input type="number" name="free" step="any" min="0" required defaultValue="0.05" />
        </label>
        <label className="field"><span>Totaal chloor (mg/L)</span>
          <input type="number" name="total" step="any" min="0" required defaultValue="0.25"
            aria-invalid={Boolean(error)} aria-describedby={error ? "chlorine-error" : undefined} />
        </label>
        <label className="field field-wide"><span>Wat merk je?</span>
          <select name="experience" defaultValue={experiences[1]}>
            {experiences.map((experience) => <option key={experience}>{experience}</option>)}
          </select>
        </label>
        <label className="field field-wide"><span>Hoeveel last heb je ervan?</span>
          <select name="impact">
            {impactOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button className="button field-wide" type="submit">Bekijk de voorbeelduitslag</button>
        {error && <p id="chlorine-error" className="field-wide" role="alert">{error}</p>}
      </form>
      <div aria-live="polite">
        {result && (
          <div className="result-panel motion-reveal">
            <h4>Voorbeelduitslag</h4>
            <dl className="measurement-list">
              <div><dt>Vrij chloor</dt><dd>{formatNumber.format(result.free)} mg/L</dd></div>
              <div><dt>Totaal chloor</dt><dd>{formatNumber.format(result.total)} mg/L</dd></div>
              <div><dt>Gebonden chloor</dt><dd>{formatNumber.format(result.total - result.free)} mg/L</dd></div>
            </dl>
            <p>{result.experience}. {impactOptions.find(([value]) => value === result.impact)?.[1]}.</p>
            <p>{result.impact === "none"
              ? "In dit scenario meld je geen hinder. Je ervaring telt mee als vergelijking in het onderzoek."
              : "Leg bij een vervolgmeting opnieuw vast wat je merkt en hoeveel last je hebt. Zo kun je de ervaringen vergelijken."}</p>
            <p>Voor een beoordeling van de drinkbaarheid is uitgebreider onderzoek nodig.</p>
            {result.impact !== "none" && <a className="text-link" href="#chloor-tips">Bekijk de smaakproef <span aria-hidden="true">↓</span></a>}
          </div>
        )}
      </div>
    </div>
  );
}

const leadQuestions = [
  {
    name: "bouwjaar",
    title: "Wanneer is je woning gebouwd?",
    options: [["old", "Vóór 1970"], ["recent", "In 1970 of later"], ["unknown", "Ik weet het niet"]],
  },
  {
    name: "leidingen",
    title: "Wat weet je over de drinkwaterleidingen?",
    options: [
      ["lead", "Ik weet of vermoed dat er lood zit."],
      ["renewed", "De volledige binneninstallatie is aantoonbaar vernieuwd."],
      ["partial", "Een deel is vernieuwd, of ik kon alleen de zichtbare leidingen bekijken."],
      ["unknown", "Ik weet het niet."],
    ],
  },
  {
    name: "woning",
    title: "Huur je de woning of ben je eigenaar?",
    options: [["tenant", "Ik huur"], ["owner", "Ik ben eigenaar"], ["other", "Anders / zeg ik liever niet"]],
  },
] as const;

export function LeadCheck() {
  const [result, setResult] = useState<{ followUp: boolean; tenant: boolean }>();

  function showNextStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answers = new FormData(event.currentTarget);
    setResult({
      followUp: answers.get("leidingen") === "lead" ||
        (answers.get("bouwjaar") !== "recent" && answers.get("leidingen") !== "renewed"),
      tenant: answers.get("woning") === "tenant",
    });
  }

  return (
    <div className="panel">
      <h3>Doe de loodzelfcheck</h3>
      <p>Drie vragen helpen je bepalen bij wie je terechtkunt. Een zelfcheck kan de aanwezigheid van lood niet vaststellen of uitsluiten.</p>
      <form className="lead-form" onSubmit={showNextStep} onChange={() => setResult(undefined)}>
        {leadQuestions.map(({ name, title, options }, index) => (
          <fieldset key={name}>
            <legend>{index + 1}. {title}</legend>
            {options.map(([value, label]) => (
              <label key={value} className="radio-field">
                <input type="radio" name={name} value={value} required />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <button className="button" type="submit">Bekijk mijn volgende stap</button>
      </form>
      <div aria-live="polite">
        {result && (
          <div className="result-panel motion-reveal">
            <h4>{result.followUp ? "Vraag advies over je leidingen" : "Controleer wat je over de aansluiting weet"}</h4>
            <p>{result.tenant
              ? "Vraag je verhuurder welke drinkwaterleidingen nog oorspronkelijk zijn en of er bewijs is van een volledige vervanging."
              : "Vraag je waterbedrijf uit welk materiaal de aansluiting bestaat. Een vakpersoon kan bij twijfel ook de binnenleidingen bekijken."}</p>
            <p>Bij een vermoeden van lood kan je waterbedrijf uitleggen hoe je een professionele staalname regelt.</p>
            <Link className="text-link" href="/contact#water-test">Vind de contactroute voor een loodtest <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </div>
      {result?.tenant && (
        <details className="test-details">
          <summary>Bekijk een voorbeeldbericht voor je verhuurder</summary>
          <p>Beste, ik wil graag weten uit welk materiaal onze drinkwaterleidingen gemaakt zijn. Weet u wanneer ze geplaatst of vervangen zijn? Als het materiaal onbekend is, kunnen we bespreken wie de leidingen kan laten nakijken? Alvast bedankt.</p>
        </details>
      )}
    </div>
  );
}
