"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const experiences = ["No chlorine smell noticed", "Slight chlorine smell", "Noticeable chlorine smell", "Different taste or smell"];
const impactOptions = [
  ["none", "It does not bother me"],
  ["some", "It bothers me, but I still drink it"],
  ["avoid", "I avoid tap water because of it"],
] as const;
const formatNumber = new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 12 });

type ChlorineResult = {
  free: number;
  total: number;
  experience: string;
  impact: string;
};

export function ChlorineDemo() {
  const [result, setResult] = useState<ChlorineResult>();
  const [error, setError] = useState("");

  function showResult(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const free = Number(data.get("free"));
    const total = Number(data.get("total"));

    if (!Number.isFinite(free) || !Number.isFinite(total) || free < 0 || total < free) {
      setError("In this demo, total chlorine cannot be lower than free chlorine. Check both input values.");
      return;
    }

    setResult({ free, total, experience: String(data.get("experience")), impact: String(data.get("impact")) });
    setError("");
  }

  return (
    <div className="panel">
      <h3>{"Try a sample result"}</h3>
      <p>{"Enter fictional values to explore the result. The demo does not save your input."}</p>
      <form className="test-form" onSubmit={showResult} onChange={() => { setResult(undefined); setError(""); }}>
        <label className="field"><span>{"Free chlorine (mg/L)"}</span>
          <input type="number" name="free" step="any" min="0" required defaultValue="0.05" />
        </label>
        <label className="field"><span>{"Total chlorine (mg/L)"}</span>
          <input type="number" name="total" step="any" min="0" required defaultValue="0.25"
            aria-invalid={Boolean(error)} aria-describedby={error ? "chlorine-error" : undefined} />
        </label>
        <label className="field field-wide"><span>{"What do you notice?"}</span>
          <select name="experience" defaultValue={experiences[1]}>
            {experiences.map((experience) => <option key={experience}>{experience}</option>)}
          </select>
        </label>
        <label className="field field-wide"><span>{"How much does it bother you?"}</span>
          <select name="impact">
            {impactOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button className="button field-wide" type="submit">{"View the sample result"}</button>
        {error && <p id="chlorine-error" className="field-wide" role="alert">{error}</p>}
      </form>
      <div aria-live="polite">
        {result && (
          <div className="result-panel motion-reveal">
            <h4>{"Sample result"}</h4>
            <dl className="measurement-list">
              <div><dt>{"Free chlorine"}</dt><dd>{formatNumber.format(result.free)} mg/L</dd></div>
              <div><dt>{"Total chlorine"}</dt><dd>{formatNumber.format(result.total)} mg/L</dd></div>
              <div><dt>{"Combined chlorine"}</dt><dd>{formatNumber.format(result.total - result.free)} mg/L</dd></div>
            </dl>
            <p>{result.experience}. {impactOptions.find(([value]) => value === result.impact)?.[1]}.</p>
            <p>{result.impact === "none"
              ? "In this scenario, you report no discomfort. Your experience counts as a comparison in the research."
              : "For a follow-up measurement, record what you notice and how much it bothers you again, so you can compare your experiences."}</p>
            <p>{"More extensive testing is needed to assess whether the water is suitable for drinking."}</p>
            {result.impact !== "none" && <a className="text-link" href="#chloor-tips">{"Explore the taste comparison "}<span aria-hidden="true">↓</span></a>}
          </div>
        )}
      </div>
    </div>
  );
}
