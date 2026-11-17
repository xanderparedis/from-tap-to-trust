import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";
import { sources } from "../_data/sources";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Intro section="Platform" title="Iets mis? Neem contact op.">
        <p>Kies waarover je melding gaat. Zo kom je bij de dienst die je vraag kan opvolgen.</p>
      </Intro>
      <div className="card-grid section-space">
        <section className="panel" id="water-test">
          <h2>Kraanwater thuis</h2>
          <p>Meld een afwijking bij je waterbedrijf. Vermeld wat je merkt, sinds wanneer en bij welke kraan. Vraag bij een vermoeden van lood hoe je een professionele staalname of loodtest kunt regelen.</p>
          <a className="text-link" href={sources.waterContact}>Contacteer je waterbedrijf <span aria-hidden="true">↗</span></a>
        </section>
        <section className="panel">
          <h2>Openbaar tappunt</h2>
          <p>Is een Antwerpse fontein defect of vuil? Meld het via het stedelijk overzicht. Geef de locatie van het tappunt door.</p>
          <a className="text-link" href={sources.fountains}>Naar de meldroute van Stad Antwerpen <span aria-hidden="true">↗</span></a>
        </section>
        <section className="panel">
          <h2>Het onderzoeksplatform</h2>
          <p>Het contactkanaal van het projectteam volgt bij de start van de proef.</p>
          <Link className="text-link" href="/">Lees de nieuwsbrief <span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </>
  );
}
