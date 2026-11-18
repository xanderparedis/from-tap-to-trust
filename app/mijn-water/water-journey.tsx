"use client";

import { useState } from "react";
import { AppIcon } from "../_components/app-icon";

const steps = [
  { id: "bron", label: "Bron", icon: "water", heading: "De Maas voedt de kanalen",
    summary: "Oppervlaktewater stroomt via het Albertkanaal en het Netekanaal naar de waterwinning.",
    actor: "Water-link · Oelegem en Walem",
    detail: "Oelegem neemt water in uit het Albertkanaal. Walem gebruikt het Netekanaal. Beide kanalen worden gevoed door de Maas." },
  { id: "zuivering", label: "Zuivering", icon: "filter", heading: "Van ruwwater naar drinkwater",
    summary: "In het productiecentrum wordt het water gezuiverd en gecontroleerd.",
    actor: "Water-link · productie",
    detail: "Verschillende behandelingsstappen verwijderen ongewenste stoffen. Water-link controleert de kwaliteit tijdens de productie." },
  { id: "verdeling", label: "Verdeling", icon: "network", heading: "Door het leidingnet naar je buurt",
    summary: "Het drinkwater gaat via het distributienet richting jouw gebouw.",
    actor: "Je waterbedrijf · distributie",
    detail: "Productie en levering kunnen door verschillende bedrijven worden verzorgd. Voor de aansluiting in Antwerpen is Water-link je aanspreekpunt." },
  { id: "kraan", label: "Jouw kraan", icon: "home", heading: "Het laatste stukje loopt door je woning",
    summary: "Vanaf de aansluiting bereikt het water via de binnenleidingen je kraan.",
    actor: "Eigenaar of gebouwbeheerder · binneninstallatie",
    detail: "Het materiaal en het onderhoud van je leidingen en toestellen kunnen het water beïnvloeden. Bij twijfel over oude leidingen helpt de loodzelfcheck je op weg." },
] as const;

export function WaterJourney({ company = "Water-link", location = "Antwerpen" }: { company?: string; location?: string }) {
  const [active, setActive] = useState(0);
  const stages = steps.map((step) => {
    if (company === "Pidpa" && step.id === "bron") return {
      ...step,
      heading: "Grondwater als belangrijke bron",
      summary: "Pidpa maakt voornamelijk drinkwater uit grondwater.",
      actor: "Pidpa · waterwinning",
      detail: "De precieze toevoer en samenstelling kunnen per adres verschillen. Pidpa geeft je de lokale informatie over de herkomst.",
    };
    if (company === "Pidpa" && step.id === "zuivering") return {
      ...step, actor: "Pidpa · productie",
      detail: "In een waterproductiecentrum wordt het gewonnen water behandeld en gecontroleerd voordat het naar het distributienet gaat.",
    };
    if (step.id === "verdeling") return {
      ...step, actor: company + " · distributie",
      detail: "Productie en levering kunnen door verschillende bedrijven worden verzorgd. Voor de aansluiting in " + location + " is " + company + " je aanspreekpunt.",
    };
    return step;
  });
  const step = stages[active];

  return (
    <section id="waterwinning-antwerpen" className="section-space water-journey" aria-labelledby="journey-title">
      <div className="section-heading">
        <div><p className="accent-label">Van bron tot kraan</p><h2 id="journey-title">De waterreis van {location}</h2></div>
        <p>Klik op een stap en ontdek wie wat doet.</p>
      </div>
      <div className="journey-canvas">
        <ol className="journey-route" aria-label="Stappen van de waterreis">
          {steps.map(({ id, label, icon }, index) => (
            <li key={id}>
              <button type="button" className="journey-node" aria-pressed={active === index}
                aria-controls="journey-detail" onClick={() => setActive(index)}>
                <span className="journey-icon"><AppIcon name={icon} /></span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>
        <div id="journey-detail" className="journey-detail" aria-live="polite">
          <div key={step.id} className="motion-reveal">
            <p className="journey-actor">{step.actor}</p>
            <h3>{step.heading}</h3>
            <p>{step.summary}</p>
            <details className="test-details">
              <summary>Meer over deze stap</summary>
              <p>{step.detail}</p>
            </details>
          </div>
        </div>
        <p className="journey-caption">Een regionaal schema. De toevoer naar een specifiek adres vraag je na bij {company}.</p>
      </div>
    </section>
  );
}
