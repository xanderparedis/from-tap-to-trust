"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Map as LeafletMap } from "leaflet";
import fountains from "../_data/antwerp-fountains.json";
import { antwerpNeighborhoods } from "../_data/antwerp-neighborhoods";

type Fountain = (typeof fountains)[number];
type Leaflet = typeof import("leaflet");

const districts = [...new Set(fountains.map((point) => point.district))].sort((a, b) => a.localeCompare(b, "nl"));

function FountainMap({ points }: { points: Fountain[] }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [leaflet, setLeaflet] = useState<Leaflet>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    import("leaflet").then(
      (module) => { if (active) setLeaflet(module); },
      () => { if (active) setFailed(true); },
    );
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!leaflet || !container.current) return;
    const instance = leaflet.map(container.current, { scrollWheelZoom: false }).setView([51.22, 4.41], 12);
    leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(instance);
    map.current = instance;
    return () => {
      instance.remove();
      map.current = null;
    };
  }, [leaflet]);

  useEffect(() => {
    const instance = map.current;
    if (!leaflet || !instance) return;
    const group = leaflet.featureGroup(points.map((point) => {
      const label = document.createElement("span");
      label.textContent = point.name + " · " + point.district;
      return leaflet.circleMarker([point.lat, point.lng], {
        radius: 7, color: "#edf2fd", weight: 2, fillColor: "#144bba", fillOpacity: 1,
      }).bindPopup(label);
    })).addTo(instance);
    if (points.length) instance.fitBounds(group.getBounds(), { padding: [24, 24], maxZoom: 15, animate: false });
    return () => { group.remove(); };
  }, [leaflet, points]);

  return failed
    ? <p className="panel" role="status">De kaart kon niet worden geladen. Je kunt de locaties hieronder bekijken.</p>
    : <div ref={container} className="map-canvas" role="region" aria-label="Kaart met openbare Antwerpse drinkwaterpunten" />;
}

export function WaterMap() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>();
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState<"public" | "horeca">("public");
  const query = search ?? searchParams.get("plaats") ?? "";
  const points = useMemo(() => {
    const term = query.trim().toLowerCase();
    const postcode = antwerpNeighborhoods.get(term);
    const matchCity = term === "antwerpen" || term === "antwerp";
    return fountains.filter((point) =>
      (!district || point.district === district) &&
      (!term || matchCity || point.postcode === postcode ||
        (point.name + " " + point.district + " " + point.postcode).toLowerCase().includes(term)),
    );
  }, [query, district]);
  const matchedNeighborhood = antwerpNeighborhoods.get(query.trim().toLowerCase());

  return (
    <section aria-label="Drinkwaterpunten zoeken">
      <div className="switcher" role="group" aria-label="Type drinkwaterpunt">
        <button type="button" aria-pressed={category === "public"} onClick={() => setCategory("public")}>Openbare tappunten</button>
        <button type="button" aria-pressed={category === "horeca"} onClick={() => setCategory("horeca")}>Restaurants en bars</button>
      </div>

      {category === "horeca" ? (
        <div className="panel panel-after-switcher">
          <h2>Restaurants en bars</h2>
          <p>Hier komen zaken die aan het project meedoen en waarvan bevestigd is dat je er kraanwater kunt vragen. Er zijn nog geen bevestigde locaties.</p>
        </div>
      ) : (
        <>
          <div className="map-filters">
            <label className="field">
              <span>Zoek op plaats, straat of postcode</span>
              <input value={query} onChange={(event) => setSearch(event.target.value)} placeholder="Bijv. Sint-Andries of 2000" />
            </label>
            <label className="field">
              <span>District</span>
              <select value={district} onChange={(event) => setDistrict(event.target.value)}>
                <option value="">Alle districten</option>
                {districts.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <p className="result-count" aria-live="polite">
            {points.length === 1 ? "1 openbaar tappunt" : points.length + " openbare tappunten"}
            {matchedNeighborhood && " · weergegeven binnen postcode " + matchedNeighborhood}
          </p>
          {points.length > 0 ? (
            <>
              <FountainMap points={points} />
              <details className="panel point-list">
                <summary>Bekijk de locaties als lijst</summary>
                <ul>
                  {points.map((point) => (
                    <li key={point.id}>
                      <strong>{point.name}</strong><span>{point.postcode} {point.district}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </>
          ) : <p className="panel" role="status">Geen tappunten gevonden. Probeer een andere postcode of kies alle districten.</p>}
        </>
      )}
    </section>
  );
}
