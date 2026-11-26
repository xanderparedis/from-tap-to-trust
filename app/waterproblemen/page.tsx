import type { Metadata } from "next";
import Link from "next/link";
import { Intro } from "../_components/content";

export const metadata: Metadata = { title: "Water issues" };

const issues = [
  { title: "My water tastes or smells different", text: "Note when you first noticed it, which tap is affected and whether it happens with cold or hot water. For a noticeable or persistent change, your water company can help investigate what is happening." },
  { title: "My water is cloudy or discoloured", text: "Note the colour, time and whether other taps are affected. Report the change to your water company so it can check for possible works or a problem with the plumbing." },
  { title: "I can see limescale", text: "Water hardness is related to calcium and magnesium, among other things. Your supplier can provide information about hardness in your neighbourhood." },
  { title: "I suspect lead pipes", text: "Old pipes and components can release lead. The self-check helps you identify indications to discuss with your water company, landlord or a qualified professional." },
];

export default function ProblemsPage() {
  return (
    <>
      <Intro section="Platform" title={"What can go wrong with tap water?"}>
        <p>{"A change may be related to the water network or the pipes in your building. Choose what you notice and see which step fits."}</p>
      </Intro>
      <div className="accordion">
        {issues.map((issue) => (
          <details key={issue.title} className="panel">
            <summary>{issue.title}</summary>
            <p>{issue.text}</p>
          </details>
        ))}
      </div>
      <div className="actions section-space">
        <Link className="button" href="/contact">{"Get in touch"}</Link>
        <Link className="text-link" href="/testresultaten#lood">{"Go to the lead self-check "}<span aria-hidden="true">↗</span></Link>
      </div>
    </>
  );
}
