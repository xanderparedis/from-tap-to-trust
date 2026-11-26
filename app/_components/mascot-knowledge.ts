import { waterFaq } from "../_data/water-faq";
import { findWaterCompany } from "../mijn-water/water-companies";

export type GuideAnswer = {
  topic: string;
  text: string;
  links: { href: string; label: string }[];
  suggestions: string[];
};

const guides: Record<string, GuideAnswer & { keywords: string }> = {
  origin: {
    topic: "origin", keywords: "source origin come comes supplier supply company herkomst vandaan bron waterbedrijf leverancier postcode buurt",
    text: "Use the water source search to find your water company by neighbourhood or postcode. You can then follow the regional journey from source, through treatment and distribution, to your tap.",
    links: [{ href: "/mijn-water", label: "Find my water company" }],
    suggestions: ["Where does Antwerp’s water come from?", "Where can I refill my bottle?"],
  },
  map: {
    topic: "map", keywords: "map kaart refill filling fill bottle thirsty nearby closest fountain fountains tappunt tappunten kraantje dorst drinkbus bijvullen locaties onderweg",
    text: "The map shows public refill points in Antwerp. Search by neighbourhood, street or postcode, or filter by district. Select a point to get directions. Restaurants and bars have their own tab; no participating venues have been confirmed yet.",
    links: [{ href: "/kaart", label: "Open the refill map" }],
    suggestions: ["There is no public tap near me", "Can you find the nearest tap automatically?"],
  },
  request: {
    topic: "request", keywords: "request suggest suggestion submit submitted aanvraag aanvragen ingediend missing ontbreekt neighbourhood neighborhood",
    text: "Below the map, you’ll find “No public tap near you?”. Enter a street and house number, postcode and municipality, then choose “Request a public tap”. This is a demo: it displays a confirmation, but does not send or save your address or arrange a new tap.",
    links: [{ href: "/kaart#refill-request-title", label: "Suggest a refill location" }],
    suggestions: ["Is my request actually sent?", "Where are the existing refill points?"],
  },
  tests: {
    topic: "tests", keywords: "test tests testing results result uitslag uitslagen testen thuistest zelfcheck resultaten meting proef proeven",
    text: "My tests has two options: a chlorine demo to compare sample measurements with taste and smell, and a five-question lead self-check about your home and pipes. The chlorine demo uses fictional values; the lead self-check gives an indication, not a measurement of lead in your water.",
    links: [{ href: "/testresultaten#chloor", label: "Try the chlorine demo" }, { href: "/testresultaten#lood", label: "Start the lead self-check" }],
    suggestions: ["How does the chlorine demo work?", "How do I check for lead pipes?"],
  },
  chlorine: {
    topic: "chlorine", keywords: "chlorine chloor dpd cuvette cuvet measurement demo free total combined vrij totaal gebonden",
    text: "In the chlorine demo, enter fictional free and total chlorine values in mg/L, then describe the smell and how much it bothers you. Total chlorine must be at least as high as free chlorine. The difference is combined chlorine. Your input is not saved, and this demo cannot establish whether your water is safe to drink.",
    links: [{ href: "/testresultaten#chloor", label: "Open the chlorine demo" }],
    suggestions: ["Why is chlorine added?", "Does a chlorine smell mean there is too much chlorine?"],
  },
  lead: {
    topic: "lead", keywords: "lead lood loden pipes leiding leidingen selfcheck tenant landlord owner huurder verhuurder eigenaar professional professioneel",
    text: "The lead self-check asks five questions about your home’s age, pipe replacement, previous findings, whether you rent or own, and your household. It shows an indication score and follow-up urgency. Depending on your answers, you can prepare a message to your landlord or a request for a professional test. You send those drafts yourself; the website does not arrange an appointment.",
    links: [{ href: "/testresultaten#lood", label: "Start the lead self-check" }, { href: "/contact#water-test", label: "Find your water company" }],
    suggestions: ["Can I book a professional test here?", "Where can I find the sources?"],
  },
  shop: {
    topic: "shop", keywords: "shop webshop buy order bottle price cost bestellen kopen drinkfles prijs kost delivery shipping verzenden levering",
    text: "The shop introduces the From Tap to Trust refillable water bottle. It is not available to order yet, and the website does not list a price or offer checkout. You can already use the map to find places to refill.",
    links: [{ href: "/webshop", label: "View the water bottle" }], suggestions: ["Where can I refill my bottle?"],
  },
  project: {
    topic: "project", keywords: "mission project website site platform purpose research citizen science onderzoek doel burgeronderzoek about newsletter nieuwsbrief news updates trust what do jullie",
    text: "From Tap to Trust aims to make tap water the natural choice through trust, reliable information, taste, accessible home testing and citizen science. The home page explains the mission; its newsletter section shares project updates and examples of future activities.",
    links: [{ href: "/#ontdek", label: "What we do" }, { href: "/#nieuwsbrief", label: "Read the newsletter" }],
    suggestions: ["How can I test my water?", "Where can I find the sources?"],
  },
  sources: {
    topic: "sources", keywords: "sources source references evidence bronnen bronvermelding betrouwbare informatie betrouwbare informatie",
    text: "The Sources page lists the references behind the website’s information about water sources, quality, pipes, tests and refill points. It also identifies the project report behind the survey and street-interview summary.",
    links: [{ href: "/bronnen", label: "Read the sources" }], suggestions: ["Is tap water safe to drink?"],
  },
  contact: {
    topic: "contact", keywords: "contact touch reach help support problem issue report complaint broken dirty defect vuil probleem problemen klacht melden hulp team",
    text: "The Contact page points you to your water company for issues at home and to the City of Antwerp for a broken or dirty public fountain. The project team’s direct contact channel will be available when the pilot starts.",
    links: [{ href: "/contact", label: "Find the right contact" }, { href: "/waterproblemen", label: "Explore water issues" }],
    suggestions: ["My water tastes different", "There is no public tap near me"],
  },
};

const aliases: Record<string, string> = {
  veilig: "safe", veiligheid: "safe", drinkbaar: "safe", drinken: "drink", smaak: "taste", smaakt: "taste", smaken: "taste",
  ruikt: "smell", geur: "smell", chloorgeur: "chlorine smell", chloor: "chlorine", kalk: "limescale",
  hardheid: "hardness", filter: "filter", filters: "filter", gefilterd: "filtered", koken: "boiling",
  kook: "boiling", flessenwater: "bottled", gezonder: "healthier", gezond: "healthy", ongezond: "unhealthy",
  bacterien: "bacteria", bacteriën: "bacteria", medicatie: "medicines", medicijnen: "medicines",
  hormonen: "hormones", riolering: "sewers", factuur: "bill", rekening: "bill", dood: "dead",
  leidingen: "pipes", leiding: "pipes", lood: "lead", loden: "lead", loodzelfcheck: "lead", chloorproef: "chlorine", stoffen: "substances", gevaar: "danger",
};
const stopWords = new Set("a an the i my me you your our we it its is are am be been do does can could would will how what why where when which who and or to of in on at for from about with this that these those water tap kraanwater drinkwater de het een ik mijn mij je jouw ons wij zijn is kan kun hoe wat waarom waar wanneer welke wie en of van op in voor over met dit dat er dan om te please tell explain uitleg uitleggen".split(" "));
const normalise = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function words(text: string) {
  const tokens = normalise(text).match(/[a-z0-9]+/g) ?? [];
  return [...new Set(tokens.flatMap(token => aliases[token]?.split(" ") ?? [token]).filter(token => !stopWords.has(token)))];
}

const faqEntries = waterFaq.flatMap(theme => theme.questions.map(([question, answer]) => ({
  question, answer, href: `/veelgestelde-vragen#${theme.id}`, tokens: words(question),
})));

export function answerWebsiteQuestion(question: string, pathname = "/", previousAnswer?: GuideAnswer): GuideAnswer {
  const text = normalise(question.trim().slice(0, 500));
  const query = words(text);
  const reply = (topic: string) => guides[topic];
  if (!text || /^(hi|hello|hey|hallo|hoi|thanks|thank you|bedankt|dank je)[!. ]*$/.test(text) || /what can you do|what can i ask|wat kan (ik|jij|je)|wie ben je|who are you/.test(text)) return {
    topic: "welcome", text: "Hi! I’m your water guide. Ask me about this website’s tests, refill map, water sources, shop or FAQs. I answer from the website’s information and can point you to the right page.",
    links: [], suggestions: ["How can I test my water?", "Where can I refill my bottle?", "Where does my water come from?"],
  };
  if (/nearest|closest|dichtst|automati|gps|geolocation|my location|mijn locatie/.test(text)) return {
    ...reply("map"), text: "The map currently searches by neighbourhood, street, postcode or district. It does not automatically use your GPS location or calculate the nearest point. Enter your area, choose a point on the map, and open directions.",
  };
  if (/\b(no|not|missing|without|geen|ontbreekt)\b.{0,45}\b(tap|fountain|refill|tappunt|kraan|kraantje)\b|\b(request|aanvraag|ingediend|aangevraagd)\b/.test(text)) return reply("request");
  if (/\b(book|booking|appointment|afspraak|boeken)\b/.test(text)) return reply("lead");
  if (/\b(safe|veilig|drinkbaar)\b/.test(text) && /right now|my (home|house|tap|water)|mijn (huis|woning|water)|op dit moment/.test(text)) return {
    topic: "contact", text: "I can explain the website’s information, but I can’t assess the safety of water from your own tap. Check your water company’s local information and use the Contact page for a concern about your home. The home-test demos do not establish whether water is safe to drink.",
    links: [{ href: "/contact#water-test", label: "Contact your water company" }, { href: "/veelgestelde-vragen#veiligheid", label: "Read about safety and quality" }], suggestions: ["How can I test my water?"],
  };
  if (/\b(here|this page|hier|deze pagina)\b/.test(text) && /\b(do|find|help|kan|vind|hulp)\b/.test(text)) {
    const topic = ({ "/kaart": "map", "/testresultaten": "tests", "/mijn-water": "origin", "/webshop": "shop", "/bronnen": "sources", "/contact": "contact" } as Record<string, string>)[pathname];
    if (topic) return reply(topic);
  }
  if (previousAnswer && /^(and |en |what about |hoe zit het met |where (can|do) i find (it|that)|waar (vind|staat)|tell me more|meer uitleg)/.test(text) && query.length < 3) return previousAnswer;

  const faq = faqEntries.map(entry => {
    const hits = entry.tokens.filter(token => query.includes(token));
    const score = hits.reduce((total, token) => total + Math.log(1 + faqEntries.length / (1 + faqEntries.filter(other => other.tokens.includes(token)).length)), 0);
    return { ...entry, score, hits: hits.length };
  }).sort((a, b) => b.score - a.score)[0];
  const actionQuestion = /\b(demo|test|testing|check|zelfcheck|book|start|find|open|page|pagina|hoe werkt|how.*work)\b/.test(text);
  const originQuestion = /\b(come|comes|vandaan|herkomst|supplier|waterbedrijf|origin)\b/.test(text) && !/sewer|riool/.test(text);
  if (faq && faq.hits > 0 && (faq.score >= 3 || query.length === 1) && !actionQuestion && !originQuestion) return {
    topic: "faq", text: faq.answer,
    links: [{ href: faq.href, label: faq.question }], suggestions: ["Where can I find the sources?", "How can I test my water?"],
  };

  const scored = Object.values(guides).map(guide => ({ guide, score: words(guide.keywords).filter(token => query.includes(token)).length +
    (guide.topic === "origin" && originQuestion ? 5 : 0) +
    (guide.topic === "lead" && query.includes("lead") ? 2 : 0) + (guide.topic === "chlorine" && query.includes("chlorine") ? 2 : 0) })).sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best?.score) {
    if (best.guide.topic === "origin") {
      const company = findWaterCompany(text) ?? text.split(/[^a-z0-9-]+/).map(token => findWaterCompany(token)).find(Boolean);
      if (company) return {
        ...reply("origin"),
        text: `${company.name} (${company.postcode}) is supplied by ${company.company}. ${company.company === "Pidpa" ? "The website explains that Pidpa mainly produces drinking water from groundwater." : "The regional water journey explains how the Meuse feeds the Albert Canal and Nete Canal, with intake at Oelegem and Walem."} The exact supply to your address should be confirmed with your water company.`,
      };
    }
    return best.guide;
  }
  if (faq && faq.score >= 2.5) return { topic: "faq", text: faq.answer, links: [{ href: faq.href, label: faq.question }], suggestions: ["Where can I find the sources?"] };
  return {
    topic: "unknown", text: "I couldn’t find a clear answer to that in the website’s information. Try asking about the refill map, home tests, water sources, shop or a water FAQ. For a question about your own water, the Contact page helps you find the right service.",
    links: [{ href: "/veelgestelde-vragen", label: "Browse the FAQs" }, { href: "/contact", label: "Find a contact" }],
    suggestions: ["How can I test my water?", "Where can I refill my bottle?"],
  };
}
