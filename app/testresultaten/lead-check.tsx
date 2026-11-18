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
      <ol className="lead-progress" aria-label="Voortgang loodzelfcheck">
        {leadQuestions.map(({ id, label }, index) => (
          <li key={id} aria-current={step === index ? "step" : undefined} data-complete={index < step}>
            <span aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </li>
        ))}
      </ol>

      {question ? (
        <div key={question.id} className="motion-reveal">
          <p className="lead-step-label">Vraag {step + 1} van {leadQuestions.length} · {question.label}</p>
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
              {step > 0 && <button type="button" className="button lead-secondary" onClick={() => goToStep(step - 1)}>Vorige</button>}
              <button className="button" type="submit" disabled={!answers[question.id]}>
                {step === leadQuestions.length - 1 ? "Bekijk mijn resultaat" : "Volgende"}
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
              <h3 ref={screenHeading} tabIndex={-1}>Jouw resultaat</h3>
              <LeadScore result={result} />
              <LeadAdvice result={result} onEdit={() => goToStep(0)} onFollowUp={() => {
                shouldFocus.current = true;
                setFollowUp(true);
              }} />
            </>
          )}
          <div className="lead-actions lead-review">
            {followUp ? (
              <button type="button" className="button lead-secondary" onClick={() => goToStep(leadQuestions.length)}>Terug naar resultaat</button>
            ) : (
              <>
                {result.category !== "possible" && <button type="button" className="button lead-secondary" onClick={() => goToStep(0)}>Antwoorden aanpassen</button>}
                <button type="button" className="text-link lead-link-button" onClick={() => {
                  setAnswers({});
                  goToStep(0);
                }}>Opnieuw beginnen</button>
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
        <meter className="sr-only" min={0} max={100} value={result.score} aria-label="Indicatiescore" />
        <strong aria-hidden="true">{result.score}<small> / 100 punten</small></strong>
      </div>
      <p className="lead-score-label">{leadResultLabels[result.category]}</p>
      <p className="lead-score-caption">Indicatie uit je antwoorden. Het loodgehalte laat je professioneel meten.</p>
      <div className="lead-urgency">
        <span>Urgentie van opvolging</span>
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
          <h4>Er zijn weinig aanwijzingen voor loden leidingen</h4>
          <p>{result.hasUnknowns ? "Op basis van de gegevens die je kent, komen weinig aanwijzingen naar voren. Ontbrekende informatie maakt de inschatting minder volledig."
            : "Je antwoorden geven weinig aanwijzingen voor loden drinkwaterleidingen in je woning."}</p>
          <p>De zelfcheck geeft een eerste inschatting. Bij concrete twijfel over je leidingen kun je je waterbedrijf of een vakpersoon om advies vragen.</p>
        </>
      )}
      {result.category === "possible" && (
        <>
          <h4>Er is nog onzekerheid over je drinkwaterleidingen</h4>
          <p>Controleer het bouwjaar, ga na wanneer de drinkwaterleidingen zijn vervangen en vraag zo nodig informatie aan de eigenaar of verhuurder.</p>
          <button type="button" className="button lead-secondary" onClick={onEdit}>Mijn informatie aanvullen</button>
          {result.extraCheck && (
            <div className="lead-notice">
              <h4>Extra controle aanbevolen</h4>
              <p>Omdat er iemand in je huishouden extra kwetsbaar is voor lood, is het zinvol om ook een professionele loodtest te laten uitvoeren.</p>
              <button type="button" className="button" onClick={onFollowUp}>Bekijk hoe je een loodtest aanvraagt</button>
            </div>
          )}
        </>
      )}
      {result.category === "strong" && (
        <>
          <h4>Laat je kraanwater professioneel testen</h4>
          <p>Je antwoorden wijzen op mogelijke loden drinkwaterleidingen. Met een professionele loodtest kun je het loodgehalte laten meten.</p>
          <details className="test-details">
            <summary>Wat kun je intussen doen?</summary>
            <p>Vraag je waterbedrijf welk voorzorgsadvies voor jouw situatie geldt. Als je kraanwater kunt blijven gebruiken, neem dan koud water voor drinken en koken en laat water dat lang heeft stilgestaan eerst doorstromen. Een professionele meting geeft uitsluitsel over het loodgehalte van het geteste staal.</p>
          </details>
          <button type="button" className="button" onClick={onFollowUp}>Bekijk hoe je een loodtest aanvraagt</button>
        </>
      )}
      {result.category === "confirmed" && (
        <>
          <h4>Laat de loden drinkwaterleidingen zo snel mogelijk vervangen</h4>
          <p>Je gaf aan dat er eerder loden drinkwaterleidingen zijn vastgesteld en dat die nog niet volledig zijn vervangen.</p>
          <button type="button" className="button" onClick={onFollowUp}>Bekijk mijn persoonlijke vervolgstappen</button>
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
      <h3 ref={headingRef} tabIndex={-1}>{tenant ? "Contacteer je verhuurder" : "Bereid je professionele loodtest voor"}</h3>
      {result.category === "confirmed" && (
        <ol className="test-steps lead-replacement-steps">
          <li>{tenant ? "Vraag je verhuurder om de loden leidingen door een installateur te laten vervangen. In Vlaamse huurwoningen zijn loden drinkwaterleidingen niet toegestaan."
            : "Schakel een installateur in om de loden leidingen na de watermeter te vervangen."}</li>
          <li>Vraag je waterbedrijf de aansluiting te onderzoeken als er daar ook een vermoeden van lood is.</li>
          <li>Bespreek met je waterbedrijf of een professionele wateranalyse aangewezen is en hoe je na de werken opvolgt.</li>
          {!tenant && <li>Vraag bij je gemeente na of er financiële steun is voor de vervanging.</li>}
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
    result.category === "confirmed" ? "Eerder vastgestelde loden drinkwaterleidingen"
      : answers.year === "before1970" ? "Oudere woning"
      : "Onvolledige informatie over de drinkwaterleidingen",
  );
  const confirmed = result.category === "confirmed";
  const message = [
    landlord.trim() ? "Beste " + landlord.trim() + "," : "Beste verhuurder,",
    "Ik heb via From Tap to Trust de loodzelfcheck voor mijn huurwoning (" + (address.trim() || "[adres van de huurwoning]") + ") ingevuld.",
    "Dit kwam uit de zelfcheck naar voren: " + reason + ".",
    confirmed
      ? "Volgens de informatie die ik heb, zijn er loden drinkwaterleidingen vastgesteld en zijn ze nog niet volledig vervangen. Kunt u een installateur inschakelen voor de vervanging en laten weten welke opvolging u voorziet?"
      : "Kunt u nagaan uit welk materiaal de drinkwaterleidingen gemaakt zijn en wanneer ze eventueel zijn vervangen? Wilt u de zelfcheck aanvullen met uw gegevens en, als verdere controle aangewezen is, een professionele loodtest regelen?",
    "Zelfcheck: " + leadCheckLink,
    "Alvast bedankt voor uw hulp.",
    "Met vriendelijke groeten,\n" + (name.trim() || "[jouw naam]"),
  ].join("\n\n");

  return (
    <>
      <p>Vul de gegevens aan om een bericht te maken dat je zelf naar je verhuurder kunt sturen.</p>
      <div className="lead-draft-fields">
        <label className="field"><span>Jouw naam</span><input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
        <label className="field"><span>Naam van je verhuurder</span><input value={landlord} onChange={(event) => setLandlord(event.target.value)} /></label>
        <label className="field"><span>Adres van de huurwoning</span><input autoComplete="street-address" value={address} onChange={(event) => setAddress(event.target.value)} /></label>
        <label className="field"><span>Welke aanwijzing kwam uit de zelfcheck?</span>
          <select value={reason} onChange={(event) => setReason(event.target.value)}>
            <option>Oudere woning</option>
            <option>Drinkwaterleidingen gedeeltelijk vervangen</option>
            <option>Onvolledige informatie over de drinkwaterleidingen</option>
            <option>Eerder vastgestelde loden drinkwaterleidingen</option>
          </select>
        </label>
      </div>
      <CopyDraft title="Voorbeeldbericht" text={message} button="Kopieer bericht" />
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
      "Beste,",
      "Ik wil graag bespreken hoe ik een professionele loodtest voor mijn kraanwater kan regelen.",
      "Naam: " + String(data.get("name")).trim(),
      "Adres: " + String(data.get("address")).trim(),
      "Gewenste datum: " + day + "/" + month + "/" + year,
      "Zelfcheck From Tap to Trust: " + result.score + "/100 punten (" + leadResultLabels[result.category] + ")",
      "Urgentie van opvolging: " + result.urgencyLabel,
      ...(data.has("share-answers") ? summary : []),
      "Kunt u laten weten hoe we de staalname kunnen regelen?",
    ];
    setDraft(lines.join("\n"));
  }

  return (
    <>
      <p>De indicatiescore en urgentie staan al in je concept. Kies een voorkeursdatum en bezorg de aanvraag zelf aan je waterbedrijf. Je waterbedrijf bevestigt de afspraak en bespreekt de uitslag met je.</p>
      <dl className="lead-draft-meta">
        <div><dt>Indicatiescore</dt><dd>{result.score} / 100 punten</dd></div>
        <div><dt>Urgentie</dt><dd>{result.urgencyLabel}</dd></div>
      </dl>
      <form className="lead-draft-fields" onSubmit={prepareRequest} onChange={() => setDraft("")}>
        <label className="field"><span>Jouw naam</span><input name="name" autoComplete="name" required pattern=".*\S.*" /></label>
        <label className="field"><span>Adres van de woning</span><input name="address" autoComplete="street-address" required pattern=".*\S.*" /></label>
        <label className="field"><span>Gewenste afspraakdatum</span><input name="preferred-date" type="date" min={new Date().toLocaleDateString("sv-SE")} required /></label>
        <label className="lead-option">
          <input type="checkbox" name="share-answers" />
          <span>Voeg mijn antwoorden over het bouwjaar, de vervanging en eerdere controles toe.</span>
        </label>
        <button type="submit" className="button">Maak mijn aanvraag klaar</button>
      </form>
      {draft && <div className="motion-reveal"><CopyDraft title="Conceptaanvraag" text={draft} button="Kopieer aanvraag" headingRef={draftHeading} /></div>}
      <Link className="text-link" href="/contact#water-test">Vind je waterbedrijf om de aanvraag te bezorgen <span aria-hidden="true">↗</span></Link>
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
      setCopyStatus({ text, message: "Gekopieerd." });
    } catch {
      field.current?.focus();
      field.current?.select();
      setCopyStatus({ text, message: "De tekst is geselecteerd. Kopieer hem via je toetsenbord of het selectiemenu." });
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
