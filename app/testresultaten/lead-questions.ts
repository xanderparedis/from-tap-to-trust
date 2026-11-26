export const leadQuestions = [
  {
    id: "year",
    label: "Year of construction",
    title: "When was your home built?",
    options: [
      ["before1970", "Before 1970"],
      ["from1970", "In or after 1970"],
      ["unknown", "I don't know"],
    ],
  },
  {
    id: "replacement",
    label: "Replacement",
    title: "Have the drinking water pipes in your home ever been fully replaced?",
    options: [
      ["all", "Yes, all drinking water pipes have been replaced"],
      ["partial", "Only partially, for example during a kitchen or bathroom renovation"],
      ["none", "No, not as far as I know"],
      ["unknown", "I don't know"],
    ],
  },
  {
    id: "inspection",
    label: "Previous findings",
    title: "Have lead drinking water pipes ever been identified in your home?",
    options: [
      ["present", "Yes, and they have not yet been fully replaced"],
      ["removed", "Yes, but they have since been fully replaced"],
      ["clear", "No, a previous inspection did not find any"],
      ["unknown", "Not checked, or I don't know"],
    ],
  },
  {
    id: "housing",
    label: "Housing situation",
    title: "Do you rent or own your home?",
    hint: "This determines which next steps you will see.",
    options: [
      ["tenant", "I am a tenant"],
      ["owner", "I am the owner"],
    ],
  },
  {
    id: "household",
    label: "Household",
    title: "Are there babies, children under six or pregnant women in your household?",
    hint: "This helps determine how urgent follow-up is. This answer does not change your indication score.",
    options: [
      ["yes", "Yes"],
      ["no", "No"],
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
  few: "Few indications",
  possible: "Possible indications",
  strong: "Strong indications",
  confirmed: "Lead pipes confirmed",
} as const;

const urgencyLabels = {
  low: "Low",
  check: "Further checks",
  elevated: "Elevated",
  high: "High",
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
