export const leadQuestions = [
  {
    id: "year",
    label: "Bouwjaar",
    title: "Wanneer werd je woning gebouwd?",
    options: [
      ["before1970", "Vóór 1970"],
      ["from1970", "In of na 1970"],
      ["unknown", "Ik weet het niet"],
    ],
  },
  {
    id: "replacement",
    label: "Vervanging",
    title: "Zijn de drinkwaterleidingen in je woning ooit volledig vervangen?",
    options: [
      ["all", "Ja, alle drinkwaterleidingen zijn vervangen"],
      ["partial", "Slechts gedeeltelijk, bijvoorbeeld bij een renovatie van de keuken of badkamer"],
      ["none", "Nee, voor zover ik weet niet"],
      ["unknown", "Ik weet het niet"],
    ],
  },
  {
    id: "inspection",
    label: "Eerdere vaststelling",
    title: "Is er ooit vastgesteld dat er loden drinkwaterleidingen in je woning aanwezig zijn of waren?",
    options: [
      ["present", "Ja, en ze zijn nog niet volledig vervangen"],
      ["removed", "Ja, maar ze zijn ondertussen volledig vervangen"],
      ["clear", "Nee, bij een eerdere controle werden er geen vastgesteld"],
      ["unknown", "Niet gecontroleerd of ik weet het niet"],
    ],
  },
  {
    id: "housing",
    label: "Woonsituatie",
    title: "Huur je de woning of ben je eigenaar?",
    hint: "Dit bepaalt welke vervolgstappen je te zien krijgt.",
    options: [
      ["tenant", "Ik ben huurder"],
      ["owner", "Ik ben eigenaar"],
    ],
  },
  {
    id: "household",
    label: "Huishouden",
    title: "Zijn er baby’s, kinderen jonger dan zes jaar of zwangere vrouwen in je huishouden?",
    hint: "Dit bepaalt mee hoe dringend opvolging is. Dit antwoord verandert je indicatiescore niet.",
    options: [
      ["yes", "Ja"],
      ["no", "Nee"],
    ],
  },
] as const;

type LeadQuestion = (typeof leadQuestions)[number];

export type LeadAnswers = {
  [Question in LeadQuestion as Question["id"]]?: Question["options"][number][0];
};

const yearPoints = { before1970: 35, from1970: 0, unknown: 0 };
const replacementPoints = { all: 0, partial: 20, none: 30, unknown: 0 };
const inspectionPoints = { present: 0, removed: 0, clear: -40, unknown: 0 };

const possibleFrom = 30;
const strongFrom = 60;

export const leadResultLabels = {
  few: "Weinig aanwijzingen",
  possible: "Mogelijke aanwijzingen",
  strong: "Sterke aanwijzingen",
  confirmed: "Loden leidingen bevestigd",
} as const;

const urgencyLabels = {
  low: "Laag",
  check: "Aanvullende controle",
  elevated: "Verhoogd",
  high: "Hoog",
} as const;

export function getLeadResult(answers: LeadAnswers) {
  const confirmed = answers.inspection === "present";
  const replaced = answers.inspection === "removed" || answers.replacement === "all";
  const points = yearPoints[answers.year ?? "unknown"] +
    replacementPoints[answers.replacement ?? "unknown"] +
    inspectionPoints[answers.inspection ?? "unknown"];
  const score = confirmed ? 100 : replaced ? 0 : Math.max(0, points);
  const category: keyof typeof leadResultLabels = confirmed ? "confirmed" : score >= strongFrom ? "strong" : score >= possibleFrom ? "possible" : "few";
  const vulnerable = answers.household === "yes";
  const extraCheck = category === "possible" && vulnerable;

  const urgency: keyof typeof urgencyLabels = confirmed || (vulnerable && (category === "possible" || category === "strong")) ? "high"
    : category === "strong" || (vulnerable && score > 0) ? "elevated"
    : category === "possible" ? "check"
    : "low";

  return {
    score, category, urgency, urgencyLabel: urgencyLabels[urgency], extraCheck,
    hasUnknowns: [answers.year, answers.replacement, answers.inspection].includes("unknown"),
  } as const;
}

export type LeadResult = ReturnType<typeof getLeadResult>;
