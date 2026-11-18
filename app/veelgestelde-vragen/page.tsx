import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";

export const metadata: Metadata = { title: "Veelgestelde vragen" };

const themes = [
  { id: "veiligheid", title: "Veiligheid & kwaliteit", intro: "Over controles, stoffen en je leidingen.", questions: [
    ["Is kraanwater veilig om te drinken?", "Ja, in normale omstandigheden. In Vlaanderen voldeed in 2024 99,56% van de analyses aan de kraan aan de kwaliteitseisen. Dat cijfer gaat over analyses, niet over woningen. De binneninstallatie kan de waterkwaliteit beïnvloeden."],
    ["Zitten er PFAS in kraanwater?", "Ja, op veel plaatsen in zeer lage concentraties. Volgens VMM voldoet het Vlaamse kraanwater aan de Europese normen. Er bestaan ook strengere streefwaarden. Voldoen aan de norm betekent dus niet dat er geen PFAS aanwezig zijn."],
    ["Zitten er drugs, medicatie of hormonen in?", "Maak onderscheid tussen afvalwater, bronwater en drinkwater. Drugsresten in de riolering zeggen niet wat uit de kraan komt. Deze stoffen kunnen in de waterketen terechtkomen. Voor uitspraken over een specifieke stof zijn meetgegevens nodig."],
    ["Zitten er bacteriën in kraanwater?", "Drinkwater moet microbiologisch veilig zijn. Voor E. coli en enterokokken geldt nul per 100 ml. Dat betekent niet dat water volledig steriel moet zijn: niet elk micro-organisme veroorzaakt ziekte. Volg bij incidenten het advies van je waterbedrijf."],
    ["Kunnen mijn leidingen het water veranderen?", "Ja. Materiaal, temperatuur en stilstand kunnen een rol spelen. Vooral loodhoudende onderdelen vragen aandacht. Sommige kunststofleidingen kunnen geurstoffen afgeven, maar dat bewijst niet dat elke kunststofleiding problemen veroorzaakt."],
  ] },
  { id: "smaak", title: "Smaak & geur", intro: "Waarom water anders kan smaken of ruiken.", questions: [
    ["Waarom smaakt water niet overal hetzelfde?", "Een drinkwaternorm is geen vast smaakrecept. Bron, mineralen, behandeling en distributie kunnen verschillen. Ook temperatuur, stilstand en huisleidingen beïnvloeden de ervaring. Anders smaken betekent niet automatisch minder veilig zijn."],
    ["Welke stoffen bepalen de smaak?", "Mineralen, opgeloste zouten, chloorresten en andere geurstoffen bepalen mee de smaak. Hun combinatie en concentratie maken het verschil. In smaakproeven worden sommige samenstellingen gemiddeld beter beoordeeld, maar niet iedereen heeft dezelfde voorkeur."],
    ["Is een slechte smaak een teken van gevaar?", "Niet automatisch. Sommige stoffen ruik je al bij zeer lage concentraties. Omgekeerd kunnen schadelijke stoffen onopgemerkt blijven. Een smaakklacht is wel een echte ervaring. Laat plotselinge, sterke of blijvende afwijkingen onderzoeken."],
    ["Waarom wordt chloor toegevoegd?", "Chloor dient voor ontsmetting en kan bescherming bieden tijdens het transport door de leidingen. Het heeft dus een functie. Chloor kan ook bijproducten vormen: daarom worden de behandeling en relevante bijproducten gecontroleerd."],
    ["Betekent chloorgeur dat er te veel chloor is?", "Nee. Chloor is al bij lage concentraties waarneembaar. Ruiken is geen concentratiemeting. Bij lichte geur kan kort laten rusten in een schone, open karaf in de koelkast helpen. Neem bij scherpe, blijvende geur contact op met het waterbedrijf."],
  ] },
  { id: "thuis", title: "Thuis & behandeling", intro: "Over kalk, filters en wat je zelf kunt doen.", questions: [
    ["Is kalk in kraanwater ongezond?", "Nee. Waterhardheid wordt vooral bepaald door calcium en magnesium. Bij normale drinkwaterconcentraties maken die het water niet ongezond. Kalkaanslag kan wel hinder geven aan kranen en toestellen. Dat is niet hetzelfde als een gezondheidsrisico."],
    ["Moet ik een waterontharder plaatsen?", "Niet om gewoon kraanwater veilig te maken. Een ontharder kan kalkaanslag verminderen. Veel toestellen vervangen calcium en magnesium door natrium. Correcte afstelling en onderhoud zijn nodig. Een ontharder verwijdert niet alle ongewenste stoffen."],
    ["Is gefilterd water gezonder?", "Niet automatisch. Een filter kan bepaalde stoffen verminderen of de smaak veranderen. Een filter tegen chloorgeur verwijdert niet noodzakelijk lood, PFAS of ziekteverwekkers. Controleer de aangetoonde prestaties en onderhoud het toestel tijdig."],
    ["Maakt koken elk water veilig?", "Nee. Koken kan ziekteverwekkers uitschakelen, maar verwijdert geen lood of PFAS. Het is geen algemene oplossing voor chemische verontreiniging. Volg bij een incident de precieze instructies: een kookadvies is iets anders dan een drinkverbod."],
    ["Wat doe ik als ik mijn water niet vertrouw?", "Bekijk de lokale kwaliteitsgegevens. Noteer geur, smaak, kleur, tijdstip en bij welke kranen het optreedt. Meld afwijkingen aan het waterbedrijf. Onderzoek kan bij een onderbouwde klacht gratis zijn; een test op eigen verzoek is niet automatisch gratis."],
  ] },
  { id: "keuzes", title: "Keuzes & misvattingen", intro: "Over flessenwater en veelgehoorde ideeën.", questions: [
    ["Is flessenwater gezonder of lekkerder?", "Flessenwater is niet gezonder omdat het in een fles zit. De mineraalsamenstelling kan wel beter bij je smaak passen. In een blinde smaakproef konden de onderzochte groepen kraan- en flessenwater niet betrouwbaar onderscheiden. Dat betekent niet dat elk water hetzelfde smaakt."],
    ["Waarom kiezen mensen toch flessenwater?", "Smaak, vertrouwen, gewoontes thuis, gemak en sociale situaties spelen allemaal mee. Wie kraanwater minder lekker of minder veilig vindt, kiest vaker voor flessenwater. Dat vertelt iets over de waterkeuze, maar bewijst niet dat het kraanwater onveilig is."],
    ["Wordt water door zuivering ‘dood’?", "Er is geen wetenschappelijke indeling in ‘levend’ en ‘dood’ drinkwater. Water hoeft geen levende organismen te bevatten om geschikt te zijn voor het lichaam. Een vlakke smaak of een minder fris gevoel kan wel echt ervaren worden, maar is iets anders dan ongezond water."],
    ["Komt drinkwater uit de riolering?", "Vlaams drinkwater komt vooral uit grond- en oppervlaktewater. Gewone rioolwaterzuivering levert nog geen drinkwater. Er bestaan wel projecten die gezuiverd afvalwater met aanvullende behandeling als bron voor drinkwater gebruiken. Dat zijn aparte processen."],
    ["Waarom is de waterfactuur zo hoog?", "Je betaalt voor drinkwaterlevering, afvoer via de riolering en zuivering van afvalwater, plus vaste kosten. De rekening gaat dus over veel meer dan je drinkwater. Vergelijk met flessenwater steeds dezelfde hoeveelheid en benoem welke kosten je meetelt."],
  ] },
];

export default function FaqPage() {
  return <>
    <Intro section="Goed om te weten" title="Veelgestelde vragen">
      <p>Een vraag over je kraanwater? Kies een thema en ontdek het antwoord.</p>
    </Intro>
    <nav className="faq-themes section-space" aria-label="Kies een vraagthema">
      {themes.map((theme, index) => <a className="panel faq-theme" href={`#${theme.id}`} key={theme.id}>
        <span className="newsletter-category">Thema 0{index + 1}</span>
        <h2>{theme.title}</h2><p>{theme.intro}</p><span aria-hidden="true">↓</span>
      </a>)}
    </nav>
    {themes.map(theme => <section className="section-space faq-section" id={theme.id} aria-labelledby={`${theme.id}-title`} key={theme.id}>
      <div className="section-heading"><h2 id={`${theme.id}-title`}>{theme.title}</h2></div>
      <div className="accordion">
        {theme.questions.map(([question, answer]) => <details className="panel" key={question} name={`faq-${theme.id}`}>
          <summary>{question}</summary><p>{answer}</p>
        </details>)}
      </div>
    </section>)}
    <section className="panel section-space">
      <h2>Staat je vraag er niet tussen?</h2><p>Laat het ons weten. We helpen je graag op weg.</p>
      <Link href="/contact" className="text-link">Neem contact op ↗</Link>
    </section>
  </>;
}
