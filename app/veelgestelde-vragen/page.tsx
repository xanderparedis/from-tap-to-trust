import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";
import { waterFaq as themes } from "../_data/water-faq";

export const metadata: Metadata = { title: "Frequently asked questions" };

export default function FaqPage() {
  return <>
    <Intro section={"Good to know"} title={"Frequently asked questions"}>
      <p>{"A question about your tap water? Choose a theme and find the answer."}</p>
    </Intro>
    <nav className="faq-themes section-space" aria-label={"Choose a question theme"}>
      {themes.map((theme, index) => <a className="panel faq-theme" href={`#${theme.id}`} key={theme.id}>
        <span className="newsletter-category">{"Theme 0"}{index + 1}</span>
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
      <h2>{"Can't find your question?"}</h2><p>{"Let us know. We are happy to help."}</p>
      <Link href="/contact" className="text-link">{"Get in touch ↗"}</Link>
    </section>
  </>;
}
