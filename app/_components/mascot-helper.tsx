"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AppIcon } from "./app-icon";
import { WaterMascot } from "./water-mascot";

const topics = [
  { href: "/mijn-water", icon: "water", title: "Waar komt mijn water vandaan?", detail: "Zoek je buurt of postcode." },
  { href: "/kaart", icon: "map", title: "Waar kan ik mijn fles vullen?", detail: "Vind een openbaar tappunt." },
  { href: "/testresultaten", icon: "tests", title: "Hoe werkt de thuistest?", detail: "Verken de test en je resultaten." },
] as const;

export function MascotHelper() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const id = "mascot-help-" + useId().replace(/:/g, "");
  const launcher = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const exitTimer = useRef<number | null>(null);

  const close = useCallback((restoreFocus = true) => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    if (restoreFocus) launcher.current?.focus({ preventScroll: true });
    if (!restoreFocus || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpen(false);
      setClosing(false);
      exitTimer.current = null;
      return;
    }
    const mascot = root.current?.querySelector(".animated-mascot");
    const panel = root.current?.querySelector(".mascot-helper-panel");
    if (mascot) root.current?.style.setProperty("--helper-exit-start", getComputedStyle(mascot).transform);
    if (panel) root.current?.style.setProperty("--helper-panel-exit-opacity", getComputedStyle(panel).opacity);
    setClosing(true);
    exitTimer.current = window.setTimeout(() => {
      setOpen(false);
      setClosing(false);
      exitTimer.current = null;
    }, 900);
  }, []);

  function show() {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    exitTimer.current = null;
    setClosing(false);
    setOpen(true);
  }

  useEffect(() => {
    if (!open || closing) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const focus = window.setTimeout(() => closeButton.current?.focus({ preventScroll: true }), reducedMotion ? 0 : 850);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focus);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closing, close]);

  useEffect(() => () => {
    if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
  }, []);

  return (
    <aside ref={root} className="mascot-helper" data-closing={closing} aria-label="Hulp bij From Tap to Trust">
      {open && (
        <div id={id} className="mascot-helper-popover" role="dialog" aria-modal="false" aria-labelledby={`${id}-title`} aria-hidden={closing || undefined} inert={closing}>
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
      <button ref={launcher} type="button" className="mascot-helper-launcher" aria-expanded={open && !closing} aria-controls={open ? id : undefined} aria-haspopup="dialog" onClick={() => open && !closing ? close() : show()}>
        <span className="mascot-helper-question" aria-hidden="true">?</span>
        <span>{open && !closing ? "Hulp sluiten" : "Hulp nodig?"}</span>
      </button>
    </aside>
  );
}
