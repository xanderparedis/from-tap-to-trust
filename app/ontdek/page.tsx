import type { Metadata } from "next";
import Link from "next/link";
import { AppIcon } from "../_components/app-icon";
import { Intro } from "../_components/content";

export const metadata: Metadata = { title: "Discover" };

const topics = [
  {
    href: "/mijn-water", icon: "water",
    title: "Where does my tap water come from?",
    description: "Search your neighbourhood or postcode and follow the journey from source to tap.",
    action: "Discover the source",
  },
  {
    href: "/veelgestelde-vragen#keuzes", icon: "discover",
    title: "Facts & misconceptions",
    description: "Explore common ideas about tap water, bottled water and the choices we make.",
    action: "Explore the facts",
  },
  {
    href: "/veelgestelde-vragen", icon: "water",
    title: "Frequently asked questions",
    description: "Find answers about quality, taste, your pipes and water at home.",
    action: "Find your answer",
  },
] as const;

export default function DiscoverPage() {
  return <>
    <Intro section={"Discover"} title={"Get to know your tap water."}>
      <p>{"From your water's source to the questions you have about it. What would you like to know?"}</p>
    </Intro>
    <nav className="start-grid section-space" aria-label={"Discover your tap water"}>
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
