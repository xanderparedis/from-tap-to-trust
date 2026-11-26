import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";
import { sources } from "../_data/sources";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Intro section="Platform" title={"Something wrong? Get in touch."}>
        <p>{"Choose what your report is about to find the service that can follow up on your question."}</p>
      </Intro>
      <div className="card-grid section-space">
        <section className="panel" id="water-test">
          <h2>{"Tap water at home"}</h2>
          <p>{"Report a change to your water company. Describe what you notice, when it started and which tap is affected. If you suspect lead, ask how to arrange professional sampling or a lead test."}</p>
          <a className="text-link" href={sources.waterContact}>{"Contact your water company "}<span aria-hidden="true">↗</span></a>
        </section>
        <section className="panel">
          <h2>{"Public refill point"}</h2>
          <p>{"Is an Antwerp fountain broken or dirty? Report it through the city's fountain overview and include the refill point's location."}</p>
          <a className="text-link" href={sources.fountains}>{"Report an issue to the City of Antwerp "}<span aria-hidden="true">↗</span></a>
        </section>
        <section className="panel">
          <h2>{"The research platform"}</h2>
          <p>{"The project team's contact channel will be available when the pilot starts."}</p>
          <Link className="text-link" href="/#nieuwsbrief">{"Read the newsletter "}<span aria-hidden="true">↗</span></Link>
        </section>
      </div>
    </>
  );
}
