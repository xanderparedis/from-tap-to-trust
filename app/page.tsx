import Image from "next/image";
import Link from "next/link";
import testkit from "../public/brand/testkit.webp";
import { NextLink } from "./_components/content";
import { startpagina } from "../inhoud.json";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <p className="section-label">{startpagina.label}</p>
          <h1>{startpagina.titel}</h1>
          <p>{startpagina.intro}</p>
          <div className="actions">
            <Link className="button button-light" href="/mijn-water">Ontdek je water <span aria-hidden="true">↗</span></Link>
            <Link className="hero-secondary" href="/testresultaten">Mijn tests <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <Image src={testkit} alt="Ontwerp van de blauwe From Tap to Trust-testkit" className="hero-photo" unoptimized preload />
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
