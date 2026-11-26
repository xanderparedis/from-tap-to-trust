import type { Metadata } from "next";
import Image from "next/image";
import { Intro, NextLink } from "../_components/content";
import { MediaPlaceholder } from "../_components/media-placeholder";
import { webshop } from "../../inhoud.json";

export const metadata: Metadata = { title: "Shop" };

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
const euro = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" });

export default function ShopPage() {
  return (
    <>
      <Intro section="From Tap to Trust" title={"Shop"}>
        <p>{webshop.intro}</p>
      </Intro>
      <section className="section-space shop-catalog" aria-labelledby="shop-products">
        <h2 id="shop-products">{"Our water bottles"}</h2>
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
                <a href={bestelLink} className="button">{"Order the water bottle"}</a>
              ) : (
                <p className="shop-availability">{"Not available to order yet"}</p>
              )}
              <NextLink href="/kaart">{"Find a refill point"}</NextLink>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
