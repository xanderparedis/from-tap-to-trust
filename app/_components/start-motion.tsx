"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function StartMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = root.current?.querySelector<HTMLElement>("[data-film-track]");
    const scene = track?.querySelector<HTMLElement>("[data-film-scene]");
    const target = scene?.querySelector<HTMLElement>("[data-film-target]");
    if (!track || !scene || !target) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference) and (min-height: 34rem)");
    let frame = 0;
    let progress = -1;
    let travel = 0;
    let needsMeasurement = true;

    function update() {
      frame = 0;
      if (!track || !scene || !target || !motion.matches) return;

      const trackBounds = track.getBoundingClientRect();
      if (needsMeasurement) {
        const sceneBounds = scene.getBoundingClientRect();
        const targetBounds = target.getBoundingClientRect();
        travel = trackBounds.height - sceneBounds.height;
        const insets = {
          top: targetBounds.top - sceneBounds.top,
          right: sceneBounds.right - targetBounds.right,
          bottom: sceneBounds.bottom - targetBounds.bottom,
          left: targetBounds.left - sceneBounds.left,
        };
        for (const [side, inset] of Object.entries(insets)) {
          scene.style.setProperty("--film-" + side, Math.max(0, inset).toFixed(2) + "px");
        }
        needsMeasurement = false;
      }
      if (travel <= 0) return;

      const position = Math.min(1, Math.max(0, -trackBounds.top / travel));
      const eased = position * position * (3 - 2 * position);
      if (eased !== progress) {
        scene.style.setProperty("--film-progress", eased.toFixed(4));
        progress = eased;
      }
    }

    function queueFrame() {
      if (!frame && motion.matches) frame = window.requestAnimationFrame(update);
    }

    function refreshGeometry() {
      needsMeasurement = true;
      queueFrame();
    }

    const resize = new ResizeObserver(refreshGeometry);
    resize.observe(track);
    resize.observe(target);
    motion.addEventListener("change", refreshGeometry);
    window.addEventListener("scroll", queueFrame, { passive: true });
    update();

    return () => {
      resize.disconnect();
      motion.removeEventListener("change", refreshGeometry);
      window.removeEventListener("scroll", queueFrame);
      window.cancelAnimationFrame(frame);
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
