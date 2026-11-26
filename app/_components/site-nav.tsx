"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppIcon } from "./app-icon";
import { MediaPlaceholder } from "./media-placeholder";

const primary = [
  ["/", "Home", "home"],
  ["/testresultaten", "My tests", "tests"],
  ["/ontdek", "Discover", "discover"],
  ["/kaart", "Map", "map"],
  ["/webshop", "Shop", "shop"],
] as const;

const secondary = [
  ["/veelgestelde-vragen", "Frequently asked questions"],
  ["/waterproblemen", "Water issues"],
  ["/#nieuwsbrief", "Newsletter"],
  ["/contact", "Contact"],
  ["/bronnen", "Sources"],
] as const;

const panels = [
  {
    label: "Discover", href: "/ontdek",
    title: "Get to know your tap water", description: "Discover the source, explore the facts and find answers to your questions.",
    image: "Water intake at the Albert Canal",
    links: [["/ontdek", "Explore everything"], ["/mijn-water", "Where does my tap water come from?"], ["/veelgestelde-vragen#keuzes", "Facts & misconceptions"], ["/veelgestelde-vragen", "Frequently asked questions"]],
  },
  {
    label: "Trusted by us", href: "/kaart",
    title: "Tap water on the go", description: "See where you can refill your bottle in Antwerp.",
    image: "Public refill point in Antwerp",
    links: [["/kaart", "Open the refill map"]],
  },
  {
    label: "My tests", href: "/testresultaten",
    title: "Test your tap water", description: "Try the chlorine demo or explore the next steps from your lead self-check.",
    image: "Test kit with cuvette and colour chart",
    links: [["/testresultaten", "All tests"], ["/testresultaten#chloor", "Chlorine test"], ["/testresultaten#lood", "Lead self-check"]],
  },
  {
    label: "More", href: null,
    title: "Follow the citizen science project", description: "Read project news, get in touch or explore our sources.",
    image: "Citizen science participants",
    links: secondary,
  },
] as const;

type Menu = (typeof panels)[number]["label"];

export function SiteNav() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<{ pathname: string; menu: Menu; pinned: boolean } | null>(null);
  const desktopToggles = useRef<Partial<Record<Menu, HTMLButtonElement | null>>>({});
  const desktopPanel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const open = openFor?.pathname === pathname ? openFor : null;
  const panel = panels.find(({ label }) => label === open?.menu);
  const moreActive = secondary.some(([href]) => href === pathname);
  const isActive = (href: string) => href === pathname ||
    (href === "/ontdek" && ["/mijn-water", "/veelgestelde-vragen"].includes(pathname));

  function toggleMenu(menu: Menu) {
    setOpenFor(open?.menu === menu && open.pinned ? null : { pathname, menu, pinned: true });
  }

  useEffect(() => {
    if (!open) return;

    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !open) return;
      setOpenFor(null);
      if (header.current?.contains(document.activeElement)) {
        const toggle = desktopToggles.current[open.menu];
        toggle?.focus();
      }
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  useEffect(() => {
    const element = header.current;
    if (!element) return;

    const viewport = window.visualViewport;
    let previous = window.scrollY;
    let direction = 0;
    let distance = 0;
    let frame = 0;

    function syncHeaderTheme() {
      const scrollTop = document.scrollingElement?.scrollTop ?? window.scrollY;
      const atTop = pathname === "/" && scrollTop <= 0 && (viewport?.pageTop ?? 0) <= 0;
      const opening = atTop ? document.querySelector("[data-film-track]")?.getBoundingClientRect() : undefined;
      element?.toggleAttribute("data-hero-top", Boolean(opening && opening.width > 0 && Math.abs(opening.top) < 1));
    }

    function updateHeader() {
      frame = 0;
      if (!element) return;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      const current = Math.max(0, Math.min(window.scrollY, limit));
      const delta = current - previous;
      previous = current;

      if (current <= 140) {
        distance = 0;
        element.removeAttribute("data-scrolled-away");
        return;
      }
      if (delta === 0) return;

      const nextDirection = Math.sign(delta);
      distance = Math.abs(delta) + (direction === nextDirection ? distance : 0);
      direction = nextDirection;
      if (direction < 0 && distance >= 30) {
        element.removeAttribute("data-scrolled-away");
      } else if (direction > 0 && distance >= 100 && !element.hasAttribute("data-scrolled-away")) {
        element.setAttribute("data-scrolled-away", "");
        setOpenFor((currentMenu) => currentMenu?.pinned ? currentMenu : null);
      }
    }

    function queueUpdate() {
      syncHeaderTheme();
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    }

    syncHeaderTheme();
    window.addEventListener("scroll", queueUpdate, { passive: true, capture: true });
    window.addEventListener("pageshow", queueUpdate);
    window.addEventListener("resize", queueUpdate);
    viewport?.addEventListener("scroll", syncHeaderTheme);
    return () => {
      window.removeEventListener("scroll", queueUpdate, true);
      window.removeEventListener("pageshow", queueUpdate);
      window.removeEventListener("resize", queueUpdate);
      viewport?.removeEventListener("scroll", syncHeaderTheme);
      window.cancelAnimationFrame(frame);
      element.removeAttribute("data-hero-top");
      element.removeAttribute("data-scrolled-away");
    };
  }, [pathname]);

  const moreLinks = (links: readonly (readonly [string, string])[]) => links.map(([href, label]) => (
    <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}
      onClick={() => setOpenFor(null)}>
      {label}<AppIcon name="arrow" />
    </Link>
  ));

  function desktopTrigger({ label, href }: (typeof panels)[number]) {
    return (
      <button key={label} ref={(node) => { desktopToggles.current[label] = node; }}
        type="button" className={href === "/testresultaten" ? "desktop-more nav-personal" : "desktop-more"}
        aria-controls="desktop-navigation-panel" aria-expanded={open?.menu === label}
        data-active={(href ? isActive(href) : moreActive) || undefined}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse" && !open?.pinned &&
            !desktopPanel.current?.contains(document.activeElement)) {
            setOpenFor({ pathname, menu: label, pinned: false });
          }
        }}
        onClick={() => toggleMenu(label)}>{label} <span className="menu-chevron" aria-hidden="true" /></button>
    );
  }

  return (
    <header ref={header} className="site-header" data-home={pathname === "/" || undefined} data-menu-pinned={Boolean(panel && open?.pinned) || undefined}>
      <div className="site-topbar">
        <div className="frame header-inner">
          <Link href="/" className="site-brand" onClick={() => setOpenFor(null)}>
            <Image src="/brand/logo.svg" alt="" width={758} height={512} className="site-logo" unoptimized />
            <span className="brand-wordmark">
              From <strong>tap</strong> to <strong>trust</strong><span className="brand-period" aria-hidden="true" />
            </span>
          </Link>
          <nav className="site-nav" aria-label={"Main navigation"}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse" && !open?.pinned &&
                !desktopPanel.current?.contains(document.activeElement)) setOpenFor(null);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setOpenFor(null);
            }}>
            <div className="site-nav-group">
              <Link href="/" aria-current={pathname === "/" ? "page" : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse" && !open?.pinned &&
                    !desktopPanel.current?.contains(document.activeElement)) setOpenFor(null);
                }}
                onClick={() => setOpenFor(null)}>{"Home"}</Link>
              {panels.slice(0, 2).map(desktopTrigger)}
            </div>
            <div className="site-nav-group">
              {panels.slice(2, 3).map(desktopTrigger)}
              <Link href="/webshop" aria-current={pathname === "/webshop" ? "page" : undefined}
                onClick={() => setOpenFor(null)}>{"Shop"}</Link>
              {panels.slice(3).map(desktopTrigger)}
            </div>
            <div id="desktop-navigation-panel" ref={desktopPanel} inert={!panel}
              data-align={panel && panels.indexOf(panel) < 2 ? "start" : undefined}
              className={panel ? "desktop-drawer is-open" : "desktop-drawer"}>
              {panel && (
                <div key={panel.label} className="more-links desktop-more-grid">
                  <div className="desktop-more-list">{moreLinks(panel.links)}</div>
                  <div className="menu-feature">
                    <MediaPlaceholder label={panel.image} />
                    <p className="menu-feature-title">{panel.title}</p>
                    <p>{panel.description}</p>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {open?.pinned && panel && (
        <button className="menu-backdrop menu-backdrop-desktop" type="button"
          aria-label={"Close menu"} tabIndex={-1} onClick={() => {
            setOpenFor(null);
            const toggle = desktopToggles.current[panel.label];
            toggle?.focus();
          }} />
      )}
      <div className="app-dock">
        <nav className="dock-tabs" aria-label={"App navigation"}>
          {primary.map(([href, label, icon]) => (
            <Link className="dock-item" key={href} href={href}
              aria-current={pathname === href ? "page" : undefined} data-active={isActive(href) || undefined}
              onClick={() => setOpenFor(null)}>
              <span className="dock-icon"><AppIcon name={icon} /></span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
