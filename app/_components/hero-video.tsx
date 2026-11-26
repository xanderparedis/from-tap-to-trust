"use client";

import { useEffect, useRef, useState } from "react";
import "./hero-video.css";

export function HeroVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = true;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      if (!element) return;
      if (!visible || document.hidden || motion.matches || manuallyPaused.current) element.pause();
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

  function toggle() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      void element.play().catch(() => {});
    } else {
      manuallyPaused.current = true;
      element.pause();
    }
  }

  return <div className="hero-video">
    <video ref={video} autoPlay muted loop playsInline preload="metadata" poster="/media/main-video-poster.jpg"
      aria-label="A cat drinking running water from a tap" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
      <source src="/media/main-video.mp4" type="video/mp4" />
      Your browser does not support this video. <a href="/media/main-video.mp4">Download the video</a>.
    </video>
    <button className="hero-video-control" type="button" onClick={toggle} aria-label={playing ? "Pause video" : "Play video"}>
      {playing ? "Pause video" : "Play video"}
    </button>
  </div>;
}
