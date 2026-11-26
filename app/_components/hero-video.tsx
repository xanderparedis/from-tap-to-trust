"use client";

import { useEffect, useRef } from "react";
import "./hero-video.css";

export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      if (!element) return;
      if (!visible || document.hidden || motion.matches) element.pause();
      else void element.play().catch(() => {});
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      element.pause();
    };
  }, []);

  return <div className="hero-video">
    <video ref={video} autoPlay muted loop playsInline preload="metadata" poster="/media/main-video-poster.jpg"
      aria-label="A cat drinking running water from a tap">
      <source src="/media/main-video.mp4" type="video/mp4" />
      Your browser does not support this video. <a href="/media/main-video.mp4">Download the video</a>.
    </video>
  </div>;
}
