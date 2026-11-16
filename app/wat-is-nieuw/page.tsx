import type { Metadata } from "next";
import { Intro, NextLink } from "../_components/content";

export const metadata: Metadata = { title: "Wat is nieuw?" };

export default function NewsPage() {
  return (
    <>
      <Intro section="Platform" title="Wat is nieuw?">
        <p>Volg wat we uit het burgeronderzoek leren en wat je al kunt uitproberen.</p>
      </Intro>
      <div className="card-grid section-space">
        <article className="panel">
          <h2>Wat we hoorden over kraanwater</h2>
          <p>In onze enquêtes en straatgesprekken kwamen smaak, vertrouwen, gewoonte en gemak terug. Sommige deelnemers vertrouwen kraanwater en kiezen toch voor flessenwater vanwege hun smaakvoorkeur.</p>
          <p className="source-note">Bron: academisch projectrapport v1.4, pp. 27–30.</p>
        </article>
        <article className="panel">
          <h2>Publieke tappunten in Antwerpen</h2>
          <p>Zoek een drinkwaterpunt op de kaart en filter de stadsgegevens per district of postcode.</p>
          <NextLink href="/kaart">Bekijk de kaart</NextLink>
        </article>
        <article className="panel">
          <h2>Probeer de testroutes</h2>
          <p>Verken hoe een chloormeting wordt teruggekoppeld en welke stappen je kunt zetten als je twijfelt over loden leidingen.</p>
          <NextLink href="/testresultaten">Naar mijn tests</NextLink>
        </article>
      </div>
    </>
  );
}
