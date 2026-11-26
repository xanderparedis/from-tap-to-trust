"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getRoute() {
  return window.location.hash === "#lood" ? "lood" : "chloor";
}

export function TestRoutes({ chlorine, lead }: { chlorine: ReactNode; lead: ReactNode }) {
  const route = useSyncExternalStore(subscribe, getRoute, () => "chloor");

  useEffect(() => {
    if (window.location.hash === "#lood" || window.location.hash === "#chloor") {
      document.getElementById(route)?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [route]);

  return (
    <>
      <nav className="test-route-picker" aria-label={"Test options"}>
        <a href="#chloor" aria-current={route === "chloor" ? "page" : undefined}>
          <span className="test-route-label">{"Chlorine test"}</span><span>{"Measurement & taste"}</span>
        </a>
        <a href="#lood" aria-current={route === "lood" ? "page" : undefined}>
          <span className="test-route-label">{"Lead self-check"}</span><span>{"Your home & pipes"}</span>
        </a>
      </nav>
      <div hidden={route !== "chloor"}>{chlorine}</div>
      <div hidden={route !== "lood"}>{lead}</div>
    </>
  );
}
