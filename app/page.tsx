export default function Home() {
  return (
    <main className="home">
      <section className="hero" aria-labelledby="project-title">
        <div className="hero-content">
          <h1 id="project-title">From Tap<br />to Trust</h1>
          <p className="hero-intro">
            Hoe smaakt jouw kraanwater? Samen onderzoeken we hoe mensen hun
            kraanwater ervaren en welke rol chloor speelt bij smaak en geur.
          </p>
          <a className="hero-link" href="#de-proef">
            Hoe werkt de proef? <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="water-visual" aria-hidden="true">
          <span className="water-ripple" />
        </div>
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
  );
}
