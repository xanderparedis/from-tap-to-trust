"use client";

import { useState } from "react";
import { AppIcon } from "../_components/app-icon";

const steps = [
  { id: "bron", label: "Source", icon: "water", heading: "The Meuse feeds the canals",
    summary: "Surface water flows through the Albert Canal and the Nete Canal to the water intake sites.",
    actor: "Water-link · Oelegem and Walem",
    detail: "Oelegem takes in water from the Albert Canal. Walem uses the Nete Canal. Both canals are fed by the Meuse." },
  { id: "zuivering", label: "Treatment", icon: "filter", heading: "From raw water to drinking water",
    summary: "The water is treated and tested at the production centre.",
    actor: "Water-link · production",
    detail: "Several treatment stages remove unwanted substances. Water-link checks the quality throughout production." },
  { id: "verdeling", label: "Distribution", icon: "network", heading: "Through the pipe network to your neighbourhood",
    summary: "Drinking water travels through the distribution network to your building.",
    actor: "Your water company · distribution",
    detail: "Different companies may handle production and supply. Water-link is your point of contact for a connection in Antwerp." },
  { id: "kraan", label: "Your tap", icon: "home", heading: "The final stretch runs through your home",
    summary: "From the connection, water reaches your tap through the building's internal pipes.",
    actor: "Owner or building manager · internal plumbing",
    detail: "The materials and maintenance of your pipes and appliances can affect your water. If you have doubts about old pipes, the lead self-check can help you get started." },
] as const;

export function WaterJourney({ company = "Water-link", location = "Antwerpen" }: { company?: string; location?: string }) {
  const [active, setActive] = useState(0);
  const stages = steps.map((step) => {
    if (company === "Pidpa" && step.id === "bron") return {
      ...step,
      heading: "Groundwater as a key source",
      summary: "Pidpa mainly produces drinking water from groundwater.",
      actor: "Pidpa · water abstraction",
      detail: "The exact supply and composition can vary by address. Pidpa can provide local information about your water's source.",
    };
    if (company === "Pidpa" && step.id === "zuivering") return {
      ...step, actor: "Pidpa · production",
      detail: "At a water production centre, the extracted water is treated and checked before entering the distribution network.",
    };
    if (step.id === "verdeling") return {
      ...step, actor: company + " · distribution",
      detail: "Different companies may handle production and supply. For a connection in " + location + ", " + company + " is your point of contact.",
    };
    return step;
  });
  const step = stages[active];

  return (
    <section id="waterwinning-antwerpen" className="section-space water-journey" aria-labelledby="journey-title">
      <div className="section-heading">
        <div><p className="accent-label">{"From source to tap"}</p><h2 id="journey-title">{"The water journey for "}{location}</h2></div>
        <p>{"Select a step to find out who does what."}</p>
      </div>
      <div className="journey-canvas">
        <ol className="journey-route" aria-label={"Steps in the water journey"}>
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
              <summary>{"More about this step"}</summary>
              <p>{step.detail}</p>
            </details>
          </div>
        </div>
        <p className="journey-caption">{"A regional overview. For information about the supply to a specific address, contact "}{company}.</p>
      </div>
    </section>
  );
}
