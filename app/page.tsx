import Image from "next/image";
import Link from "next/link";
import testkit from "../public/brand/testkit.webp";
import waterSymbol from "../public/brand/water-symbol.png";

export default function Home() {
  return (
    <>
      <header className="site-header frame">
        <Link href="/" className="site-brand" aria-label="From Tap to Trust, startpagina">
          <Image
            src="/brand/logo.svg"
            alt=""
            width={758}
            height={512}
            className="site-logo"
            unoptimized
          />
          <span>From tap to trust.</span>
        </Link>
        <nav aria-label="Hoofdnavigatie">
          <a href="#de-proef">De proef</a>
        </nav>
      </header>

      <main className="frame">
        <section className="hero" aria-labelledby="project-title">
          <div className="hero-content">
            <p className="hero-label">Burgeronderzoek naar kraanwater</p>
            <h1 id="project-title">Hoe smaakt jouw kraanwater?</h1>
            <p className="hero-intro">
              Samen onderzoeken we hoe mensen hun kraanwater ervaren en welke
              rol chloor speelt bij smaak en geur.
            </p>
            <a className="hero-link" href="#de-proef">
              Hoe werkt de proef? <span aria-hidden="true">↓</span>
            </a>
          </div>
          <Image
            src={testkit}
            alt="Ontwerp van de blauwe From Tap to Trust-testkit"
            className="testkit"
            unoptimized
            preload
          />
        </section>

        <section className="trial" id="de-proef" aria-labelledby="trial-title">
          <h2 id="trial-title">Van thuistest naar resultaat</h2>
          <ol className="trial-steps">
            <li>
              <h3>Test thuis</h3>
              <p>Meet chloor in je eigen kraanwater met een testkit.</p>
            </li>
            <li>
              <h3>Deel je ervaring</h3>
              <p>Noteer de meetwaarde en beschrijf hoe het water smaakt en ruikt.</p>
            </li>
            <li>
              <h3>Bekijk je resultaat</h3>
              <p>Lees wat de meting vertelt over chloor en hoe je de uitslag kunt interpreteren.</p>
            </li>
          </ol>
          <p className="trial-status">De proef is in voorbereiding. Inzenden kan zodra ze opent.</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="frame footer-content">
          <Image src={waterSymbol} alt="" width={28} height={28} unoptimized />
          <span>From Tap to Trust</span>
        </div>
      </footer>
    </>
  );
}
