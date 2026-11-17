"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function StartMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver !== "function" ||
      !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-enter]") ?? []);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.removeAttribute("data-enter-waiting");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });

    for (const element of elements) {
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      element.setAttribute("data-enter-waiting", "");
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      for (const element of elements) element.removeAttribute("data-enter-waiting");
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
