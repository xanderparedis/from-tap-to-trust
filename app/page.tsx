import Image from "next/image";
import Link from "next/link";
import { AppIcon } from "./_components/app-icon";
import { NextLink } from "./_components/content";
import { MascotSlot } from "./_components/mascot-slot";
import { start, nieuwsbrief } from "../inhoud.json";
import testkit from "../public/brand/testkit.webp";

type NewsletterEntry = {
  rubriek: string;
  titel: string;
  tekst: string;
  afbeelding?: { pad: string; alt: string } | null;
  link?: { adres: string; tekst: string } | null;
};

const entries: NewsletterEntry[] = nieuwsbrief.berichten;
const featureIcons = { "/mijn-water": "water", "/kaart": "map", "/testresultaten": "tests" } as const;

export default function Home() {
  return (
    <>
      <section className="start-hero" aria-labelledby="start-title">
        <div className="start-hero-copy">
          <p className="section-label">{start.label}</p>
          <h1 id="start-title">{start.titel}</h1>
          <p>{start.intro}</p>
          <a className="button start-button" href="#ontdek">Ontdek de app <span aria-hidden="true">↓</span></a>
        </div>
        <div className="start-hero-art">
          <Image src={testkit} alt="Ontwerp van de From Tap to Trust-testkit" unoptimized preload />
          <MascotSlot slot="start" />
        </div>
      </section>

      <section id="ontdek" className="start-features" aria-labelledby="start-features-title">
        <h2 id="start-features-title">{start.functiesTitel}</h2>
        <div className="start-grid">
          {start.functies.map(({ titel, tekst, adres, actie }) => (
            <Link className="start-tile" key={adres} href={adres}>
              <span className="tile-icon"><AppIcon name={featureIcons[adres as keyof typeof featureIcons] ?? "arrow"} /></span>
              <div>
                <h3>{titel}</h3>
                <p>{tekst}</p>
              </div>
              <span className="tile-action">{actie}<span className="tile-arrow"><AppIcon name="arrow" /></span></span>
            </Link>
          ))}
        </div>
        <details className="panel start-details">
          <summary>{start.meer.titel}</summary>
          <p>{start.meer.tekst}</p>
          <NextLink href="/waterproblemen">Wat kan er misgaan met kraanwater?</NextLink>
        </details>
      </section>

      <section id="nieuwsbrief" className="newsletter" aria-labelledby="newsletter-title">
        <header className="newsletter-header">
          <div>
            <h2 id="newsletter-title">{nieuwsbrief.titel}</h2>
            <p>{nieuwsbrief.intro}</p>
          </div>
          <MascotSlot slot="nieuwsbrief" />
        </header>

        <div className="newsletter-feed">
          {entries.map(({ rubriek, titel, tekst, afbeelding, link }) => (
            <article className={afbeelding ? "newsletter-entry has-image" : "newsletter-entry"} key={titel}>
              <div className="newsletter-copy">
                <p className="newsletter-category">{rubriek}</p>
                <h3>{titel}</h3>
                <p>{tekst}</p>
                {link && <NextLink href={link.adres}>{link.tekst}</NextLink>}
              </div>
              {afbeelding && (
                <Image className="newsletter-image" src={afbeelding.pad} alt={afbeelding.alt}
                  width={880} height={735} unoptimized />
              )}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
