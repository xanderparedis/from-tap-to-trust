import type { Metadata } from "next";
import { Intro } from "../_components/content";
import { MediaPlaceholder } from "../_components/media-placeholder";
import { ChlorineDemo } from "./test-tools";
import { LeadCheck } from "./lead-check";
import { TestRoutes } from "./test-routes";

export const metadata: Metadata = { title: "Mijn tests en resultaten" };

export default function TestsPage() {
  return (
    <>
      <Intro section="Persoonlijk gedeelte" title="Mijn tests en resultaten">
        <p>Kies je proef. Je ziet stap voor stap wat je kunt doen.</p>
      </Intro>
      <TestRoutes
        chlorine={(
          <section className="test-section section-space" id="chloor" aria-labelledby="chlorine-title">
            <div className="section-heading">
              <div>
                <h2 id="chlorine-title">Chloor</h2>
                <p>Leg de meting naast wat je ruikt, proeft of als hinder ervaart.</p>
              </div>
            </div>
            <div className="feature-grid test-grid">
              <ChlorineDemo />
              <div className="panel test-guide">
                <MediaPlaceholder label="Cuvet met DPD en een kleurkaart" />
                <details className="test-details">
                  <summary>Hoe werkt de chloorproef?</summary>
                  <ol className="test-steps">
                    <li>Neem een vers waterstaal.</li>
                    <li>Meet vrij chloor met DPD1 en totaal chloor met DPD3 volgens de instructies van de testkit.</li>
                    <li>Bereken het verschil en noteer wat je ruikt, proeft en of je er last van hebt.</li>
                  </ol>
                </details>
                <details className="test-details" id="chloor-tips" name="chlorine-guide">
                  <summary>Grandma’s tricks · smaakproef</summary>
                  <p>Als je kraanwater geschikt is om te drinken en je de smaak wilt vergelijken, proef het eens op kamertemperatuur en gekoeld uit een schone karaf.</p>
                </details>
                <details className="test-details" name="chlorine-guide">
                  <summary>Wat als ik een verandering merk?</summary>
                  <p>Bij een plotse of aanhoudende verandering in smaak, geur of kleur kun je je waterbedrijf om advies vragen.</p>
                </details>
              </div>
            </div>
          </section>
        )}
        lead={(
          <section className="test-section section-space" id="lood" aria-labelledby="lead-title">
            <div className="section-heading">
              <div>
                <h2 id="lead-title">Lood</h2>
                <p>Doorloop de loodzelfcheck in vijf vragen.</p>
              </div>
            </div>
            <div className="feature-grid test-grid">
              <LeadCheck />
              <div className="panel test-guide">
                <MediaPlaceholder label="Watermeter met zichtbare leiding en koppeling" />
                <details className="test-details" name="lead-guide">
                  <summary>Waar kan ik op letten?</summary>
                  <p>Kijk bij de watermeter naar bereikbare leidingen. Een grijze leiding waar een magneet niet aan blijft hangen, met verdikkingen waar buizen samenkomen, kan op lood wijzen. Veel leidingen zitten achter muren of onder de vloer.</p>
                </details>
                <details className="test-details" name="lead-guide">
                  <summary>Hoe verloopt een professionele test?</summary>
                  <p>Vraag je waterbedrijf wie de staalname kan uitvoeren. De uitvoerder spreekt af waar en hoe een staal genomen wordt. Met de uitslag bespreek je wat de meting betekent voor de geteste kraan en welke vervolgstap bij je installatie past.</p>
                </details>
              </div>
            </div>
          </section>
        )}
      />
    </>
  );
}
