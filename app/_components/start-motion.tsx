"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function StartMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = root.current?.querySelector<HTMLElement>("[data-film-stage]");
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (!stage || !motion.matches) return;

    let frame = 0;
    function queueFrame() {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const distance = Math.min(window.innerHeight * 0.5, 430);
        const progress = Math.min(1, Math.max(0, window.scrollY / distance));
        stage?.style.setProperty("--film-progress", progress.toFixed(3));
      });
    }

    window.addEventListener("scroll", queueFrame, { passive: true });
    window.addEventListener("resize", queueFrame);
    queueFrame();

    return () => {
      window.removeEventListener("scroll", queueFrame);
      window.removeEventListener("resize", queueFrame);
      window.cancelAnimationFrame(frame);
      stage.style.removeProperty("--film-progress");
    };
  }, []);

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
