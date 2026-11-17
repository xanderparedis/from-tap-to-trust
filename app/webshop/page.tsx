import type { Metadata } from "next";
import Image from "next/image";
import { Intro, NextLink } from "../_components/content";
import { MediaPlaceholder } from "../_components/media-placeholder";
import { webshop } from "../../inhoud.json";

export const metadata: Metadata = { title: "Webshop" };

type Product = {
  id: string;
  titel: string;
  tekst: string;
  beeldPlaceholder: string;
  afbeelding: { pad: string; alt: string } | null;
  prijs: number | null;
  bestelLink: string | null;
};

const products: Product[] = webshop.producten;
const euro = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });

export default function ShopPage() {
  return (
    <>
      <Intro section="From Tap to Trust" title="Webshop">
        <p>{webshop.intro}</p>
      </Intro>
      <section className="section-space shop-catalog" aria-labelledby="shop-products">
        <h2 id="shop-products">Onze drinkflessen</h2>
        {products.map(({ id, titel, tekst, beeldPlaceholder, afbeelding, prijs, bestelLink }) => (
          <article className="panel shop-product" key={id}>
            <div className="shop-image">
              {afbeelding ? (
                <Image src={afbeelding.pad} alt={afbeelding.alt} width={800} height={600} unoptimized />
              ) : (
                <MediaPlaceholder label={beeldPlaceholder} />
              )}
            </div>
            <div>
              <h3>{titel}</h3>
              <p>{tekst}</p>
              {prijs !== null && <p className="shop-price">{euro.format(prijs)}</p>}
              {bestelLink ? (
                <a href={bestelLink} className="button">Bestel de drinkfles</a>
              ) : (
                <p className="shop-availability">Nog niet te bestellen</p>
              )}
              <NextLink href="/kaart">Vind een tappunt</NextLink>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
