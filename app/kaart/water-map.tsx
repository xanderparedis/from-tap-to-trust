"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Map as LeafletMap, Marker } from "leaflet";
import fountains from "../_data/antwerp-fountains.json";
import { antwerpNeighborhoods } from "../_data/antwerp-neighborhoods";

type Fountain = (typeof fountains)[number];
type Leaflet = typeof import("leaflet");

const districts = [...new Set(fountains.map((point) => point.district))].sort((a, b) => a.localeCompare(b, "nl"));

function FountainMap({ points, selected, onSelect }: { points: Fountain[]; selected: Fountain | undefined; onSelect: (id: number) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const [leaflet, setLeaflet] = useState<Leaflet>();
  const [failed, setFailed] = useState(false);
  const markers = useRef(new Map<number, Marker>());
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

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
      const popup = document.createElement("div");
      popup.className = "fountain-popup";
      const title = document.createElement("strong");
      title.textContent = point.name;
      const location = document.createElement("p");
      location.textContent = point.postcode + " " + point.district;
      const route = document.createElement("a");
      route.href = "https://www.google.com/maps/dir/?api=1&destination=" + point.lat + "," + point.lng;
      route.textContent = "Directions to this refill point ↗";
      popup.append(title, location, route);
      const marker = leaflet.marker([point.lat, point.lng], {
        title: point.name,
        alt: point.name,
        icon: leaflet.divIcon({
          className: "fountain-pin",
          html: '<span class="fountain-pin-body" aria-hidden="true"></span>',
          iconSize: [34, 40],
          iconAnchor: [17, 38],
          popupAnchor: [0, -35],
        }),
      }).bindPopup(popup);
      marker.on("click", () => onSelectRef.current(point.id));
      markers.current.set(point.id, marker);
      return marker;
    })).addTo(instance);
    const currentMarkers = markers.current;
    if (points.length) instance.fitBounds(group.getBounds(), { padding: [38, 38], maxZoom: 15, animate: false });
    return () => {
      group.remove();
      currentMarkers.clear();
    };
  }, [leaflet, points]);

  useEffect(() => {
    const instance = map.current;
    if (!selected || !instance || !leaflet) return;
    instance.setView([selected.lat, selected.lng], Math.max(instance.getZoom(), 15), { animate: false });
    markers.current.get(selected.id)?.openPopup();
  }, [selected, leaflet, points]);

  return failed
    ? <p className="panel" role="status">{"The map could not be loaded. You can view the locations below."}</p>
    : <div ref={container} className="map-canvas" role="region" aria-label={"Map of public drinking water points in Antwerp"} />;
}

export function WaterMap() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState<string>();
  const [district, setDistrict] = useState("");
  const [selectedId, setSelectedId] = useState<number>();
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
  const selected = points.find((point) => point.id === selectedId);
  const matchedNeighborhood = antwerpNeighborhoods.get(query.trim().toLowerCase());

  return (
    <section className="map-workspace" aria-label={"Find drinking water points"}>
      <div className="switcher" role="group" aria-label={"Type of drinking water point"}>
        <button type="button" aria-pressed={category === "public"} onClick={() => setCategory("public")}>{"Public refill points"}</button>
        <button type="button" aria-pressed={category === "horeca"} onClick={() => setCategory("horeca")}>{"Restaurants and bars"}</button>
      </div>

      {category === "horeca" ? (
        <div className="panel panel-after-switcher motion-reveal">
          <h2>{"Restaurants and bars"}</h2>
          <p>{"This is where we will list participating venues that have confirmed you can ask for tap water. No locations have been confirmed yet."}</p>
        </div>
      ) : (
        <>
          <div className="map-filters">
            <label className="field">
              <span>{"Search by place, street or postcode"}</span>
              <input value={query} onChange={(event) => setSearch(event.target.value)} placeholder={"E.g. Sint-Andries or 2000"} />
            </label>
            <label className="field">
              <span>District</span>
              <select value={district} onChange={(event) => setDistrict(event.target.value)}>
                <option value="">{"All districts"}</option>
                {districts.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <p className="result-count" aria-live="polite">
            {points.length === 1 ? "1 public refill point" : points.length + " public refill points"}
            {matchedNeighborhood && " · shown within postcode " + matchedNeighborhood}
          </p>
          {points.length > 0 ? (
            <>
              <div className="map-frame">
                <FountainMap points={points} selected={selected} onSelect={setSelectedId} />
                <div className="map-key"><span aria-hidden="true" />{"Public refill point"}</div>
              </div>
              {selected && (
                <div className="panel selected-fountain motion-reveal">
                  <div><p className="accent-label">{"Your refill point"}</p><h3>{selected.name}</h3><p>{selected.postcode} {selected.district}</p></div>
                  <a className="button" href={"https://www.google.com/maps/dir/?api=1&destination=" + selected.lat + "," + selected.lng}>{"Get directions "}<span aria-hidden="true">↗</span></a>
                </div>
              )}
              <details className="panel point-list">
                <summary>{"View locations as a list"}</summary>
                <ul>
                  {points.map((point) => (
                    <li key={point.id}>
                      <button type="button" className="point-list-button" onClick={() => setSelectedId(point.id)}
                        aria-pressed={point.id === selectedId}>
                        <strong>{point.name}</strong><span>{point.postcode} {point.district}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </>
          ) : <p className="panel" role="status">{"No refill points found. Try another postcode or select all districts."}</p>}
        </>
      )}
    </section>
  );
}
