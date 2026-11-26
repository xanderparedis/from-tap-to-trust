import Image from "next/image";
import Link from "next/link";
import { AppIcon } from "./_components/app-icon";
import { NextLink } from "./_components/content";
import { MascotSlot } from "./_components/mascot-slot";
import { StartMotion } from "./_components/start-motion";
import { start, nieuwsbrief } from "../inhoud.json";
import { MediaPlaceholder } from "./_components/media-placeholder";
import "./home-story.css";

type NewsletterEntry = {
  rubriek: string;
  titel: string;
  tekst: string;
  beeldPlaceholder?: string;
  afbeelding?: { pad: string; alt: string } | null;
  link?: { adres: string; tekst: string } | null;
};

const entries: NewsletterEntry[] = nieuwsbrief.berichten;
const featureIcons = { "/ontdek": "water", "/kaart": "map", "/testresultaten": "tests" } as const;

export default function Home() {
  return (
    <StartMotion>
      <div className="start-film-track" data-film-track>
        <section className="start-scene" data-film-scene aria-labelledby="start-title">
          <div className="start-hero frame">
            <div className="start-hero-copy">
              <p className="section-label">{start.label}</p>
              <h1 id="start-title">{start.titel}</h1>
              <p>{start.intro}</p>
              <a className="button start-button" href="#ontdek">{"Explore the app "}<span aria-hidden="true">↓</span></a>
            </div>
            <div className="start-hero-art" data-film-target>
              <div className="start-film">
                <MediaPlaceholder kind="Video" label={start.videoPlaceholder} />
              </div>
              <MascotSlot slot="start" />
            </div>
          </div>
        </section>
      </div>

      <section id="ontdek" className="frame home-story" aria-labelledby="home-mission-title">
        <div className="home-mission" data-enter lang="en">
          <h2 id="home-mission-title">{start.missie.titel}</h2>
          <div className="home-mission-copy">
            <p className="home-mission-lead">{start.missie.intro}</p>
            <p>{start.missie.tekst}</p>
          </div>
        </div>
        <div className="home-why" data-enter>
          <div lang="en">
            <h2>{start.waarom.titel}</h2>
            <p className="home-why-statement">{start.waarom.tekst}</p>
          </div>
          <p>{"Discover "}<Link href="/ontdek">{"where your tap water comes from"}</Link>{" and browse the "}<Link href="/veelgestelde-vragen">{"frequently asked questions"}</Link>.</p>
        </div>
      </section>

      <section className="frame start-features home-actions" lang="en" aria-labelledby="start-features-title">
        <h2 id="start-features-title" data-enter>{start.functiesTitel}</h2>
        <div className="start-grid">
          {start.functies.map(({ titel, tekst, adres, actie }) => (
            <Link className="start-tile" data-enter key={adres} href={adres}>
              <span className="tile-icon"><AppIcon name={featureIcons[adres as keyof typeof featureIcons] ?? "arrow"} /></span>
              <div>
                <h3>{titel}</h3>
                <p>{tekst}</p>
              </div>
              <span className="tile-action">{actie}<span className="tile-arrow"><AppIcon name="arrow" /></span></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="nieuwsbrief" className="frame newsletter" aria-labelledby="newsletter-title">
        <header className="newsletter-header" data-enter>
          <div>
            <h2 id="newsletter-title">{nieuwsbrief.titel}</h2>
            <p>{nieuwsbrief.intro}</p>
          </div>
          <MascotSlot slot="nieuwsbrief" />
        </header>

        <div className="newsletter-feed">
          {entries.map(({ rubriek, titel, tekst, afbeelding, beeldPlaceholder, link }) => (
            <article data-enter className={afbeelding || beeldPlaceholder ? "newsletter-entry has-image" : "newsletter-entry"} key={titel}>
              <div className="newsletter-copy">
                <p className="newsletter-category">{rubriek}</p>
                <h3>{titel}</h3>
                <p>{tekst}</p>
                {link && <NextLink href={link.adres}>{link.tekst}</NextLink>}
              </div>
              {afbeelding ? (
                <Image className="newsletter-image" src={afbeelding.pad} alt={afbeelding.alt}
                  width={880} height={735} unoptimized />
              ) : beeldPlaceholder && (
                <MediaPlaceholder label={beeldPlaceholder} />
              )}
            </article>
          ))}
        </div>
      </section>
    </StartMotion>
  );
}
