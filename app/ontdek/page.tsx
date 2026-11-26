import type { Metadata } from "next";
import Link from "next/link";
import { AppIcon } from "../_components/app-icon";
import { Intro } from "../_components/content";

export const metadata: Metadata = { title: "Ontdek" };

const topics = [
  {
    href: "/mijn-water", icon: "water",
    title: "Waar komt mijn kraanwater vandaan?",
    description: "Zoek je buurt of postcode en volg de reis van bron tot kraan.",
    action: "Ontdek de herkomst",
  },
  {
    href: "/veelgestelde-vragen#keuzes", icon: "discover",
    title: "Feiten & misvattingen",
    description: "Verken veelgehoorde ideeën over kraanwater, flessenwater en de keuzes die we maken.",
    action: "Bekijk de feiten",
  },
  {
    href: "/veelgestelde-vragen", icon: "water",
    title: "Veelgestelde vragen",
    description: "Vind antwoorden over kwaliteit, smaak, je leidingen en water thuis.",
    action: "Vind je antwoord",
  },
] as const;

export default function DiscoverPage() {
  return <>
    <Intro section="Ontdek" title="Leer je kraanwater kennen.">
      <p>Van de herkomst van je water tot de vragen die je erover hebt. Waar ben je benieuwd naar?</p>
    </Intro>
    <nav className="start-grid section-space" aria-label="Ontdek je kraanwater">
      {topics.map(({ href, icon, title, description, action }) => (
        <Link className="start-tile" href={href} key={href}>
          <span className="tile-icon"><AppIcon name={icon} /></span>
          <div><h2>{title}</h2><p>{description}</p></div>
          <span className="tile-action">{action}</span>
        </Link>
      ))}
    </nav>
  </>;
}
