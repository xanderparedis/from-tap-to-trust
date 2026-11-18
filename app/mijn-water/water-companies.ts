import { antwerpNeighborhoods } from "../_data/antwerp-neighborhoods";

const antwerpPlaces = [
  ["2000", "Antwerpen"], ["2018", "Antwerpen"], ["2020", "Antwerpen"],
  ["2030", "Antwerpen"], ["2040", "Berendrecht-Zandvliet-Lillo"], ["2050", "Linkeroever"],
  ["2060", "Antwerpen"], ["2100", "Deurne"], ["2140", "Borgerhout"],
  ["2150", "Borsbeek"], ["2170", "Merksem"], ["2180", "Ekeren"],
  ["2600", "Berchem"], ["2610", "Wilrijk"], ["2660", "Hoboken"],
] as const;

const places = [
  ...antwerpPlaces.map(([postcode, name]) => ({ postcode, name, company: "Water-link", waterJourney: true })),
  { postcode: "2640", name: "Mortsel", company: "Water-link", waterJourney: true },
  { postcode: "2650", name: "Edegem", company: "Water-link", waterJourney: true },
  { postcode: "2900", name: "Schoten", company: "Pidpa", waterJourney: false },
  { postcode: "2930", name: "Brasschaat", company: "Pidpa", waterJourney: false },
];

export function findWaterCompany(input: string) {
  const query = input.trim().toLowerCase().replace(/\s+/g, " ");
  const alias = new Map([
    ["antwerp", "2000"], ["berendrecht", "2040"], ["zandvliet", "2040"],
    ["lillo", "2040"], ["berendrecht – zandvliet – lillo", "2040"],
  ]);
  const postcode = query.match(/\b[1-9]\d{3}\b/)?.[0] ?? alias.get(query) ?? antwerpNeighborhoods.get(query);
  return places.find((place) => place.postcode === postcode || place.name.toLowerCase() === query);
}
