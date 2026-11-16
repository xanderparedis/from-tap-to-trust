import type { Metadata } from "next";
import { Intro, NextLink } from "../_components/content";
import { watIsNieuw } from "../../inhoud.json";

export const metadata: Metadata = { title: watIsNieuw.titel };

export default function NewsPage() {
  return (
    <>
      <Intro section="Platform" title={watIsNieuw.titel}>
        <p>{watIsNieuw.intro}</p>
      </Intro>
      <div className="card-grid section-space">
        {watIsNieuw.kaarten.map((card) => (
          <article className="panel" key={card.titel}>
            <h2>{card.titel}</h2>
            <p>{card.tekst}</p>
            {card.link && <NextLink href={card.link.adres}>{card.link.tekst}</NextLink>}
          </article>
        ))}
      </div>
    </>
  );
}
