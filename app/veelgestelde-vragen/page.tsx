import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";

export const metadata: Metadata = { title: "Frequently asked questions" };

const themes = [
  { id: "veiligheid", title: "Safety & quality", intro: "About checks, substances and your pipes.", questions: [
    ["Is tap water safe to drink?", "Yes, under normal circumstances. In Flanders in 2024, 99.56% of tap water analyses met the quality requirements. This figure refers to analyses, not homes. The building's internal plumbing can affect water quality."],
    ["Are there PFAS in tap water?", "Yes, in many places at very low concentrations. According to VMM, Flemish tap water meets European standards. Stricter target values also exist. Meeting the standard does not mean that no PFAS are present."],
    ["Does it contain drugs, medicines or hormones?", "Distinguish between wastewater, source water and drinking water. Drug residues in sewers do not tell you what comes out of the tap. These substances can enter the water cycle. Measurement data is needed to make claims about a specific substance."],
    ["Are there bacteria in tap water?", "Drinking water must be microbiologically safe. The limit for E. coli and enterococci is zero per 100 ml. This does not mean water must be completely sterile: not every microorganism causes disease. Follow your water company's advice during incidents."],
    ["Can my pipes change the water?", "Yes. Materials, temperature and stagnation can play a role. Components containing lead need particular attention. Some plastic pipes can release substances that cause odours, but this does not show that every plastic pipe causes problems."],
  ] },
  { id: "smaak", title: "Taste & smell", intro: "Why water can taste or smell different.", questions: [
    ["Why doesn't water taste the same everywhere?", "A drinking water standard is not a fixed recipe for taste. Sources, minerals, treatment and distribution can differ. Temperature, stagnation and household pipes also affect the experience. A different taste does not automatically mean the water is less safe."],
    ["Which substances determine the taste?", "Minerals, dissolved salts, chlorine residues and other odour-causing substances all contribute to taste. Their combination and concentration make the difference. Taste tests rate some compositions higher on average, but preferences vary."],
    ["Is a bad taste a sign of danger?", "Not automatically. Some substances can be smelled at very low concentrations. Conversely, harmful substances can go unnoticed. A taste complaint is still a real experience. Have sudden, strong or persistent changes investigated."],
    ["Why is chlorine added?", "Chlorine disinfects the water and can provide protection during transport through the pipes. It serves a purpose. Chlorine can also form by-products, which is why treatment and relevant by-products are monitored."],
    ["Does a chlorine smell mean there is too much chlorine?", "No. Chlorine can be detected at low concentrations. Smelling it is not a concentration measurement. For a mild smell, briefly leaving the water in a clean, open jug in the fridge may help. Contact your water company if the smell is sharp or persistent."],
  ] },
  { id: "thuis", title: "Water at home & treatment", intro: "About limescale, filters and what you can do.", questions: [
    ["Is limescale in tap water unhealthy?", "No. Water hardness is mainly determined by calcium and magnesium. At normal drinking water concentrations, they do not make the water unhealthy. Limescale can be a nuisance on taps and appliances. That is different from a health risk."],
    ["Should I install a water softener?", "Not to make ordinary tap water safe. A softener can reduce limescale. Many units replace calcium and magnesium with sodium. Correct settings and maintenance are needed. A softener does not remove all unwanted substances."],
    ["Is filtered water healthier?", "Not automatically. A filter can reduce certain substances or change the taste. A filter for chlorine odour does not necessarily remove lead, PFAS or pathogens. Check the proven performance and maintain the unit on time."],
    ["Does boiling make all water safe?", "No. Boiling can kill pathogens, but it does not remove lead or PFAS. It is not a general solution for chemical contamination. Follow the specific instructions during an incident: a boil-water notice is different from a do-not-drink notice."],
    ["What should I do if I don't trust my water?", "Check the local quality data. Note the smell, taste, colour, time and which taps are affected. Report changes to your water company. An investigation may be free for a substantiated complaint; a test at your own request is not automatically free."],
  ] },
  { id: "keuzes", title: "Choices & misconceptions", intro: "About bottled water and common beliefs.", questions: [
    ["Is bottled water healthier or tastier?", "Bottled water is not healthier simply because it comes in a bottle. Its mineral composition may suit your taste better. In a blind taste test, the groups studied could not reliably distinguish between tap and bottled water. That does not mean all water tastes the same."],
    ["Why do people still choose bottled water?", "Taste, trust, habits at home, convenience and social situations all play a part. People who find tap water less tasty or less safe are more likely to choose bottled water. This tells us something about water choices, but does not prove that tap water is unsafe."],
    ["Does treatment make water ‘dead’?", "There is no scientific classification of ‘living’ and ‘dead’ drinking water. Water does not need to contain living organisms to be suitable for the body. A flat taste or a less fresh sensation can be real experiences, but are different from unhealthy water."],
    ["Does drinking water come from sewers?", "Flemish drinking water mainly comes from groundwater and surface water. Ordinary sewage treatment does not produce drinking water. Some projects do use treated wastewater as a source for drinking water after additional treatment. These are separate processes."],
    ["Why is the water bill so high?", "You pay for drinking water supply, sewerage and wastewater treatment, plus fixed charges. The bill covers much more than your drinking water. When comparing with bottled water, always compare the same volume and state which costs you include."],
  ] },
];

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
