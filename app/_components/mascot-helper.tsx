"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { AppIcon } from "./app-icon";
import { WaterMascot } from "./water-mascot";

const topics = [
  { href: "/mijn-water", icon: "water", title: "Waar komt mijn water vandaan?", detail: "Zoek je buurt of postcode." },
  { href: "/kaart", icon: "map", title: "Waar kan ik mijn fles vullen?", detail: "Vind een openbaar tappunt." },
  { href: "/testresultaten", icon: "tests", title: "Hoe werkt de thuistest?", detail: "Verken de test en je resultaten." },
] as const;

export function MascotHelper() {
  const [open, setOpen] = useState(false);
  const id = "mascot-help-" + useId().replace(/:/g, "");
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) launcher.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!open) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focus = window.setTimeout(() => closeButton.current?.focus({ preventScroll: true }), reducedMotion ? 0 : 850);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus({ preventScroll: true });
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <aside className="mascot-helper" aria-label="Hulp bij From Tap to Trust">
      {open && (
        <div id={id} className="mascot-helper-popover" role="dialog" aria-modal="false" aria-labelledby={`${id}-title`}>
          <div className="mascot-helper-panel">
            <header className="mascot-helper-heading">
              <div>
                <p className="mascot-helper-eyebrow">Ik help je op weg</p>
                <h2 id={`${id}-title`}>Waar zoek je hulp bij?</h2>
              </div>
              <button ref={closeButton} type="button" className="mascot-helper-close" onClick={() => close()} aria-label="Hulp sluiten">
                <span aria-hidden="true">×</span>
              </button>
            </header>
            <nav className="mascot-helper-topics" aria-label="Kies je hulpvraag">
              {topics.map(topic => (
                <Link key={topic.href} href={topic.href} className="mascot-helper-topic" onClick={() => close(false)}>
                  <span className="mascot-helper-topic-icon"><AppIcon name={topic.icon} /></span>
                  <span><strong>{topic.title}</strong><span>{topic.detail}</span></span>
                  <AppIcon name="arrow" />
                </Link>
              ))}
            </nav>
            <div className="mascot-helper-more">
              <Link href="/veelgestelde-vragen" onClick={() => close(false)}>Bekijk alle veelgestelde vragen <span aria-hidden="true">↗</span></Link>
              <Link href="/contact" onClick={() => close(false)}>Kom je er niet uit? Neem contact op.</Link>
            </div>
          </div>
          <div className="mascot-helper-window"><WaterMascot /></div>
        </div>
      )}
      <button ref={launcher} type="button" className="mascot-helper-launcher" aria-expanded={open} aria-controls={open ? id : undefined} aria-haspopup="dialog" onClick={() => open ? close() : setOpen(true)}>
        <span className="mascot-helper-question" aria-hidden="true">?</span>
        <span>{open ? "Hulp sluiten" : "Hulp nodig?"}</span>
      </button>
    </aside>
  );
}
