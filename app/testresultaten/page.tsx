import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { ChlorineDemo, LeadCheck } from "./test-tools";

export const metadata: Metadata = { title: "Mijn tests en resultaten" };

export default function TestsPage() {
  return (
    <>
      <Intro section="Persoonlijk gedeelte" title="Mijn tests en resultaten">
        <p>Bekijk hoe de terugkoppeling van een chloortest werkt of doorloop de zelfcheck voor loden leidingen.</p>
      </Intro>
      <nav className="section-nav" aria-label="Testroutes">
        <a href="#chloor">Chloor · uitslag en tips</a>
        <a href="#lood">Lood · zelfcheck en opvolging</a>
      </nav>

      <section className="test-section section-space" id="chloor" aria-labelledby="chlorine-title">
        <div className="section-heading">
          <div>
            <h2 id="chlorine-title">Chloor</h2>
            <p>Bekijk de meting naast hoe je het water ervaart.</p>
          </div>
        </div>
        <div className="feature-grid">
          <ChlorineDemo />
          <div className="panel">
            <h3>Grandma’s tricks</h3>
            <p>Als je kraanwater geschikt is om te drinken en je vooral de smaak wilt aanpassen, proef het eens gekoeld uit een schone karaf. Je kunt ook een paar druppels citroen toevoegen.</p>
            <h3>Volgende stap</h3>
            <p>Vergelijk je smaakervaring voor en na het koelen. Bij een opvallende of aanhoudende verandering in smaak, geur of kleur vraag je je waterbedrijf om advies.</p>
          </div>
        </div>
      </section>

      <section className="test-section section-space" id="lood" aria-labelledby="lead-title">
        <div className="section-heading">
          <div>
            <h2 id="lead-title">Lood</h2>
            <p>Van zelfcheck naar advies over een professionele staalname.</p>
          </div>
        </div>
        <div className="feature-grid">
          <LeadCheck />
          <div className="panel">
            <h3>Na de test</h3>
            <p>Je krijgt de uitslag en de interpretatie van het labo of je waterbedrijf. Bespreek met de uitvoerder wat het resultaat betekent voor de geteste kraan en welke maatregelen passen bij de oorzaak.</p>
            <p>Neem bij een probleem in de binneninstallatie ook contact op met de eigenaar of gebouwbeheerder.</p>
          </div>
        </div>
      </section>
    </>
  );
}
