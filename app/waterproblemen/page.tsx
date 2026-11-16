import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";
import { sources } from "../_data/sources";

export const metadata: Metadata = { title: "Waterproblemen" };

const issues = [
  { title: "Mijn water smaakt of ruikt anders", text: "Noteer sinds wanneer je het merkt, bij welke kraan en of het voorkomt bij koud of warm water. Bij een opvallende of aanhoudende verandering kan je waterbedrijf helpen uitzoeken wat er aan de hand is.", href: sources.waterQuality, source: "AquaFlanders" },
  { title: "Mijn water is troebel of verkleurd", text: "Noteer de kleur, het tijdstip en of het bij meer kranen voorkomt. Meld de afwijking bij je waterbedrijf, zodat het kan nagaan of er bijvoorbeeld werkzaamheden of een probleem in de installatie spelen.", href: sources.waterQuality, source: "AquaFlanders" },
  { title: "Ik zie kalkaanslag", text: "De hardheid van water hangt onder meer samen met calcium en magnesium. Je leverancier geeft informatie over de hardheid in je buurt.", href: sources.waterQuality, source: "AquaFlanders" },
  { title: "Ik vermoed loden leidingen", text: "Oude leidingen en onderdelen kunnen lood afgeven. Met de zelfcheck vind je aanwijzingen om te bespreken met je waterbedrijf, verhuurder of een vakpersoon.", href: sources.lead, source: "Vlaamse Milieumaatschappij" },
];

export default function ProblemsPage() {
  return (
    <>
      <Intro section="Platform" title="Wat kan er misgaan met kraanwater?">
        <p>Een verandering kan te maken hebben met het waternet of met de leidingen in je gebouw. Kies wat je merkt en bekijk welke stap past.</p>
      </Intro>
      <div className="accordion">
        {issues.map((issue) => (
          <details key={issue.title} className="panel">
            <summary>{issue.title}</summary>
            <p>{issue.text}</p>
            <a className="text-link" href={issue.href}>Bron: {issue.source} <span aria-hidden="true">↗</span></a>
          </details>
        ))}
      </div>
      <div className="actions section-space">
        <Link className="button" href="/contact">Neem contact op</Link>
        <Link className="text-link" href="/testresultaten#lood">Naar de loodzelfcheck <span aria-hidden="true">↗</span></Link>
      </div>
    </>
  );
}
