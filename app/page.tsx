import Image from "next/image";
import Link from "next/link";
import testkit from "../public/brand/testkit.webp";
import { NextLink } from "./_components/content";
import { AppIcon } from "./_components/app-icon";
import { startpagina } from "../inhoud.json";

const shortcuts = [
  ["/mijn-water", "Herkomst", "water"],
  ["/waterproblemen", "Problemen", "help"],
  ["/kaart", "Tappunten", "map"],
  ["/testresultaten", "Mijn tests", "tests"],
] as const;

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <p className="section-label">{startpagina.label}</p>
          <h1>{startpagina.titel}</h1>
          <p>{startpagina.intro}</p>
          <div className="actions">
            <Link className="button button-accent" href="/mijn-water">Ontdek je water <span aria-hidden="true">↗</span></Link>
            <Link className="hero-secondary" href="/testresultaten">Mijn tests <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <Image src={testkit} alt="Ontwerp van de blauwe From Tap to Trust-testkit" className="hero-photo" unoptimized preload />
      </section>

      <section className="app-shortcuts" aria-labelledby="shortcuts-title">
        <h2 id="shortcuts-title">Snel naar</h2>
        <div className="shortcut-grid">
          {shortcuts.map(([href, label, icon]) => (
            <Link key={href} className="shortcut" href={href}>
              <span className="shortcut-icon"><AppIcon name={icon} /></span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space" aria-labelledby="platform-title">
        <div className="section-heading">
          <h2 id="platform-title">{startpagina.hoofdlijst}</h2>
          <NextLink href="/wat-is-nieuw">Wat is nieuw?</NextLink>
        </div>
        <div className="card-grid">
          {startpagina.kaarten.map((topic) => (
            <Link className="feature-card" key={topic.link} href={topic.link}>
              <h3>{topic.titel}</h3>
              <p>{topic.tekst}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="de-proef" className="home-test" aria-labelledby="home-test-title">
        <div>
          <h2 id="home-test-title">{startpagina.testTitel}</h2>
          <p>{startpagina.testUitleg}</p>
        </div>
        <Link className="button" href="/testresultaten">Naar mijn tests <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
