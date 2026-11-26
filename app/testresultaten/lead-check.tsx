"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, RefObject } from "react";
import { getLeadResult, leadQuestions, leadResultLabels } from "./lead-questions";
import type { LeadAnswers, LeadResult } from "./lead-questions";

const urgencyLevels = { low: 1, check: 2, elevated: 3, high: 4 } as const;

export function LeadCheck() {
  const [answers, setAnswers] = useState<LeadAnswers>({});
  const [step, setStep] = useState(0);
  const [followUp, setFollowUp] = useState(false);
  const screenHeading = useRef<HTMLHeadingElement>(null);
  const shouldFocus = useRef(false);
  const question = leadQuestions[step];
  const result = question ? null : getLeadResult(answers);

  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    screenHeading.current?.focus();
  }, [step, followUp]);

  function goToStep(nextStep: number) {
    shouldFocus.current = true;
    setFollowUp(false);
    setStep(nextStep);
  }

  return (
    <div className="panel lead-check">
      <ol className="lead-progress" aria-label={"Lead self-check progress"}>
        {leadQuestions.map(({ id, label }, index) => (
          <li key={id} aria-current={step === index ? "step" : undefined} data-complete={index < step}>
            <span aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ol>

      {question ? (
        <div key={question.id} className="motion-reveal">
          <p className="lead-step-label">{"Question "}{step + 1}{" of "}{leadQuestions.length} · {question.label}</p>
          <h3 id="lead-question" ref={screenHeading} tabIndex={-1}>{question.title}</h3>
          {"hint" in question && <p id="lead-question-hint">{question.hint}</p>}
          <form className="lead-form" onSubmit={(event) => {
            event.preventDefault();
            if (answers[question.id]) goToStep(step + 1);
          }}>
            <fieldset aria-labelledby="lead-question" aria-describedby={"hint" in question ? "lead-question-hint" : undefined}>
              {question.options.map(([value, label]) => (
                <label className="lead-option" key={value}>
                  <input type="radio" name={question.id} value={value} required checked={answers[question.id] === value}
                    onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: value }))} />
                  <span>{label}</span>
                </label>
              ))}
            </fieldset>
            <div className="lead-actions">
              {step > 0 && <button type="button" className="button lead-secondary" onClick={() => goToStep(step - 1)}>{"Previous"}</button>}
              <button className="button" type="submit" disabled={!answers[question.id]}>
                {step === leadQuestions.length - 1 ? "View my result" : "Next"}
              </button>
            </div>
          </form>
        </div>
      ) : result && (
        <div className="motion-reveal" key={followUp ? "follow-up" : "result"}>
          {followUp ? (
            <LeadFollowUp answers={answers} result={result} headingRef={screenHeading} />
          ) : (
            <>
              <h3 ref={screenHeading} tabIndex={-1}>{"Your result"}</h3>
              <LeadScore result={result} />
              <LeadAdvice result={result} onEdit={() => goToStep(0)} onFollowUp={() => {
                shouldFocus.current = true;
                setFollowUp(true);
              }} />
            </>
          )}
          <div className="lead-actions lead-review">
            {followUp ? (
              <button type="button" className="button lead-secondary" onClick={() => goToStep(leadQuestions.length)}>{"Back to result"}</button>
            ) : (
              <>
                {result.category !== "possible" && <button type="button" className="button lead-secondary" onClick={() => goToStep(0)}>{"Edit answers"}</button>}
                <button type="button" className="text-link lead-link-button" onClick={() => {
                  setAnswers({});
                  goToStep(0);
                }}>{"Start again"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LeadScore({ result }: { result: LeadResult }) {
  return (
    <div className="lead-score" data-alert={result.category === "strong" || result.category === "confirmed" || result.urgency === "high" || undefined}>
      <div className="lead-gauge" style={{ "--lead-score-angle": (result.score * 1.8) + "deg" } as CSSProperties}>
        <meter className="sr-only" min={0} max={100} value={result.score} aria-label={"Indication score"} />
        <strong aria-hidden="true">{result.score}<small>{" / 100 points"}</small></strong>
      </div>
      <p className="lead-score-label">{leadResultLabels[result.category]}</p>
      <p className="lead-score-caption">{"An indication based on your answers. Have the lead concentration measured professionally."}</p>
      <div className="lead-urgency">
        <span>{"Follow-up urgency"}</span>
        <strong>{result.urgencyLabel}</strong>
        <div className="lead-urgency-steps" aria-hidden="true">
          {[1, 2, 3, 4].map((level) => <span key={level} data-filled={level <= urgencyLevels[result.urgency]} />)}
        </div>
      </div>
    </div>
  );
}

function LeadAdvice({ result, onEdit, onFollowUp }: {
  result: LeadResult;
  onEdit: () => void;
  onFollowUp: () => void;
}) {
  return (
    <div className="lead-advice">
      {result.category === "few" && (
        <>
          <h4>{"There are few indications of lead pipes"}</h4>
          <p>{result.hasUnknowns ? "The information you know suggests few indications. Missing information makes the assessment less complete."
            : "Your answers give few indications of lead drinking water pipes in your home."}</p>
          <p>{"The self-check provides an initial assessment. If you have specific concerns about your pipes, ask your water company or a qualified professional for advice."}</p>
        </>
      )}
      {result.category === "possible" && (
        <>
          <h4>{"There is still uncertainty about your drinking water pipes"}</h4>
          <p>{"Check the year your home was built, find out when the drinking water pipes were replaced and, if necessary, ask the owner or landlord for information."}</p>
          <button type="button" className="button lead-secondary" onClick={onEdit}>{"Add more information"}</button>
          {result.extraCheck && (
            <div className="lead-notice">
              <h4>{"Further checks recommended"}</h4>
              <p>{"Because someone in your household is particularly vulnerable to lead, it is also worth arranging a professional lead test."}</p>
              <button type="button" className="button" onClick={onFollowUp}>{"See how to request a lead test"}</button>
            </div>
          )}
        </>
      )}
      {result.category === "strong" && (
        <>
          <h4>{"Have your tap water tested professionally"}</h4>
          <p>{"Your answers suggest that lead drinking water pipes may be present. A professional lead test can measure the lead concentration."}</p>
          <details className="test-details">
            <summary>{"What can you do in the meantime?"}</summary>
            <p>{"Ask your water company which precautions apply to your situation. If you can continue using your tap water, use cold water for drinking and cooking, and let water that has been standing for a long time run first. A professional measurement establishes the lead concentration in the sample tested."}</p>
          </details>
          <button type="button" className="button" onClick={onFollowUp}>{"See how to request a lead test"}</button>
        </>
      )}
      {result.category === "confirmed" && (
        <>
          <h4>{"Have the lead drinking water pipes replaced as soon as possible"}</h4>
          <p>{"You indicated that lead drinking water pipes were identified previously and have not yet been fully replaced."}</p>
          <button type="button" className="button" onClick={onFollowUp}>{"View my personal next steps"}</button>
        </>
      )}
    </div>
  );
}

function LeadFollowUp({ answers, result, headingRef }: {
  answers: LeadAnswers;
  result: LeadResult;
  headingRef: RefObject<HTMLHeadingElement | null>;
}) {
  const tenant = answers.housing === "tenant";
  return (
    <>
      <h3 ref={headingRef} tabIndex={-1}>{tenant ? "Contact your landlord" : "Prepare for your professional lead test"}</h3>
      {result.category === "confirmed" && (
        <ol className="test-steps lead-replacement-steps">
          <li>{tenant ? "Ask your landlord to have a plumber replace the lead pipes. Lead drinking water pipes are not permitted in rented homes in Flanders."
            : "Arrange for a plumber to replace the lead pipes after the water meter."}</li>
          <li>{"Ask your water company to inspect the connection if lead is also suspected there."}</li>
          <li>{"Discuss with your water company whether a professional water analysis is appropriate and how to follow up after the work."}</li>
          {!tenant && <li>{"Ask your municipality whether financial support is available for replacement."}</li>}
        </ol>
      )}
      {tenant ? <TenantDraft answers={answers} result={result} /> : <OwnerDraft answers={answers} result={result} />}
    </>
  );
}

const leadCheckLink = "https://from-tap-to-trust.vercel.app/testresultaten#lood";

function TenantDraft({ answers, result }: { answers: LeadAnswers; result: LeadResult }) {
  const [name, setName] = useState("");
  const [landlord, setLandlord] = useState("");
  const [address, setAddress] = useState("");
  const [reason, setReason] = useState(
    result.category === "confirmed" ? "Previously identified lead drinking water pipes"
      : answers.year === "before1970" ? "Older home"
      : "Incomplete information about the drinking water pipes",
  );
  const confirmed = result.category === "confirmed";
  const message = [
    landlord.trim() ? "Dear " + landlord.trim() + "," : "Dear landlord,",
    "I completed the From Tap to Trust lead self-check for my rented home (" + (address.trim() || "[address of the rented home]") + ").",
    "The self-check highlighted the following: " + reason + ".",
    confirmed
      ? "According to the information I have, lead drinking water pipes have been identified and have not yet been fully replaced. Could you arrange for a plumber to replace them and let me know what follow-up you plan?"
      : "Could you check what material the drinking water pipes are made from and whether and when they were replaced? Please complete the self-check with your information and arrange a professional lead test if further checks are recommended.",
    "Self-check: " + leadCheckLink,
    "Thank you for your help.",
    "Kind regards,\n" + (name.trim() || "[your name]"),
  ].join("\n\n");

  return (
    <>
      <p>{"Fill in the details to draft a message that you can send to your landlord yourself."}</p>
      <div className="lead-draft-fields">
        <label className="field"><span>{"Your name"}</span><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="field"><span>{"Your landlord's name"}</span><input value={landlord} onChange={(event) => setLandlord(event.target.value)} /></label>
        <label className="field"><span>{"Address of the rented home"}</span><input autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} /></label>
        <label className="field"><span>{"What did the self-check indicate?"}</span>
          <select value={reason} onChange={(event) => setReason(event.target.value)}>
            <option>{"Older home"}</option>
            <option>{"Drinking water pipes partially replaced"}</option>
            <option>{"Incomplete information about the drinking water pipes"}</option>
            <option>{"Previously identified lead drinking water pipes"}</option>
          </select>
        </label>
      </div>
      <CopyDraft title={"Sample message"} text={message} button={"Copy message"} />
    </>
  );
}

function OwnerDraft({ answers, result }: { answers: LeadAnswers; result: LeadResult }) {
  const [draft, setDraft] = useState("");
  const draftHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (draft) draftHeading.current?.focus();
  }, [draft]);

  function prepareRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const [year, month, day] = String(data.get("preferred-date")).split("-");
    const summary = leadQuestions.slice(0, 3).map((question) => {
      const answer = question.options.find(([value]) => value === answers[question.id]);
      return question.label + ": " + answer?.[1];
    });
    const lines = [
      "Dear Sir or Madam,",
      "I would like to discuss how to arrange a professional lead test for my tap water.",
      "Name: " + String(data.get("name")).trim(),
      "Address: " + String(data.get("address")).trim(),
      "Preferred date: " + day + "/" + month + "/" + year,
      "From Tap to Trust self-check: " + result.score + "/100 points (" + leadResultLabels[result.category] + ")",
      "Follow-up urgency: " + result.urgencyLabel,
      ...(data.has("share-answers") ? summary : []),
      "Could you let me know how we can arrange sampling?",
    ];
    setDraft(lines.join("\n"));
  }

  return (
    <>
      <p>{"Your indication score and urgency are already included in your draft. Choose a preferred date and send the request to your water company yourself. Your water company will confirm the appointment and discuss the result with you."}</p>
      <dl className="lead-draft-meta">
        <div><dt>{"Indication score"}</dt><dd>{result.score}{" / 100 points"}</dd></div>
        <div><dt>{"Urgency"}</dt><dd>{result.urgencyLabel}</dd></div>
      </dl>
      <form className="lead-draft-fields" onSubmit={prepareRequest} onChange={() => setDraft("")}>
        <label className="field"><span>{"Your name"}</span><input name="name" autoComplete="name" required pattern=".*\S.*" /></label>
        <label className="field"><span>{"Home address"}</span><input name="address" autoComplete="street-address" required pattern=".*\S.*" /></label>
        <label className="field"><span>{"Preferred appointment date"}</span><input name="preferred-date" type="date" min={new Date().toLocaleDateString("sv-SE")} required /></label>
        <label className="lead-option">
          <input type="checkbox" name="share-answers" />
          <span>{"Include my answers about the year of construction, pipe replacement and previous inspections."}</span>
        </label>
        <button type="submit" className="button">{"Prepare my request"}</button>
      </form>
      {draft && <div className="motion-reveal"><CopyDraft title={"Draft request"} text={draft} button={"Copy request"} headingRef={draftHeading} /></div>}
      <Link className="text-link" href="/contact#water-test">{"Find your water company to send your request "}<span aria-hidden="true">↗</span></Link>
    </>
  );
}

function CopyDraft({ title, text, button, headingRef }: {
  title: string;
  text: string;
  button: string;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [copyStatus, setCopyStatus] = useState<{ text: string; message: string }>();

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ text, message: "Copied." });
    } catch {
      field.current?.focus();
      field.current?.select();
      setCopyStatus({ text, message: "The text is selected. Copy it using your keyboard or the selection menu." });
    }
  }

  return (
    <div className="lead-draft">
      <h4 ref={headingRef} tabIndex={headingRef ? -1 : undefined}>{title}</h4>
      <textarea ref={field} aria-label={title} value={text} readOnly rows={8} />
      <button type="button" className="button" onClick={copy}>{button}</button>
      <span role="status">{copyStatus?.text === text ? copyStatus.message : ""}</span>
    </div>
  );
}
