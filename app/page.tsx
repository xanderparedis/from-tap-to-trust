import Image from "next/image";
import { NextLink } from "./_components/content";
import { MascotSlot } from "./_components/mascot-slot";
import { nieuwsbrief } from "../inhoud.json";

type NewsletterEntry = {
  rubriek: string;
  titel: string;
  tekst: string;
  afbeelding?: { pad: string; alt: string } | null;
  link?: { adres: string; tekst: string } | null;
};

const entries: NewsletterEntry[] = nieuwsbrief.berichten;

export default function Home() {
  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <header className="newsletter-header">
        <div>
          <h1 id="newsletter-title">{nieuwsbrief.titel}</h1>
          <p>{nieuwsbrief.intro}</p>
        </div>
        <MascotSlot slot="nieuwsbrief" />
      </header>

      <div className="newsletter-feed">
        {entries.map(({ rubriek, titel, tekst, afbeelding, link }) => (
          <article className={afbeelding ? "newsletter-entry has-image" : "newsletter-entry"} key={titel}>
            <div className="newsletter-copy">
              <p className="newsletter-category">{rubriek}</p>
              <h2>{titel}</h2>
              <p>{tekst}</p>
              {link && <NextLink href={link.adres}>{link.tekst}</NextLink>}
            </div>
            {afbeelding && (
              <Image className="newsletter-image" src={afbeelding.pad} alt={afbeelding.alt}
                width={880} height={735} unoptimized />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
