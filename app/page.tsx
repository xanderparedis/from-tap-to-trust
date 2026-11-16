import Image from "next/image";
import Link from "next/link";
import testkit from "../public/brand/testkit.webp";
import { NextLink } from "./_components/content";

const topics = [
  { title: "Waar komt mijn water vandaan?", text: "Volg je kraanwater van bron tot kraan en vind je waterbedrijf.", href: "/mijn-water" },
  { title: "Iets anders aan je water?", text: "Zoek uit wat je kunt doen bij vreemde smaak, geur of kleur.", href: "/waterproblemen" },
  { title: "Vul bij onderweg", text: "Vind publieke drinkwaterpunten en ontdek de Trusted by us-kaart.", href: "/kaart" },
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-content">
          <p className="section-label">Burgeronderzoek naar kraanwater</p>
          <h1>Leer je kraanwater kennen.</h1>
          <p>Waar komt het vandaan, hoe smaakt het en waar vul je onderweg bij? Van je eigen kraan tot het tappunt om de hoek.</p>
          <div className="actions">
            <Link className="button button-light" href="/mijn-water">Ontdek je water <span aria-hidden="true">↗</span></Link>
            <Link className="hero-secondary" href="/testresultaten">Mijn tests <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <Image src={testkit} alt="Ontwerp van de blauwe From Tap to Trust-testkit" className="hero-photo" unoptimized preload />
      </section>

      <section className="section-space" aria-labelledby="platform-title">
        <div className="section-heading">
          <h2 id="platform-title">Jouw water, van dichtbij</h2>
          <NextLink href="/wat-is-nieuw">Wat is nieuw?</NextLink>
        </div>
        <div className="card-grid">
          {topics.map((topic) => (
            <Link className="feature-card" key={topic.href} href={topic.href}>
              <h3>{topic.title}</h3>
              <p>{topic.text}</p>
              <span className="card-arrow" aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="de-proef" className="home-test" aria-labelledby="home-test-title">
        <div>
          <h2 id="home-test-title">Van thuistest naar resultaat</h2>
          <p>Bekijk een voorbeeld van een chloormeting of doorloop de zelfcheck voor loden leidingen.</p>
        </div>
        <Link className="button" href="/testresultaten">Naar mijn tests <span aria-hidden="true">↗</span></Link>
      </section>
    </>
  );
}
