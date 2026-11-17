"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { AppIcon } from "./app-icon";

const primary = [
  ["/", "Start", "home"],
  ["/mijn-water", "Herkomst", "water"],
  ["/kaart", "Kaart", "map"],
  ["/testresultaten", "Mijn tests", "tests"],
] as const;

const secondary = [
  ["/wat-is-nieuw", "Wat is nieuw?"],
  ["/waterproblemen", "Waterproblemen"],
  ["/contact", "Contact"],
  ["/bronnen", "Bronnen"],
] as const;

const desktop = [
  secondary[0], primary[1], secondary[1], ["/kaart", "Trusted by us"], primary[3], secondary[2],
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const isOpen = openFor === pathname;
  const moreActive = secondary.some(([href]) => href === pathname);

  function closeMenu() {
    setOpenFor(null);
    toggle.current?.focus();
  }

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeMenu();
      }
    }}>
      <div className="frame header-inner">
        <Link href="/" className="site-brand" onClick={() => setOpenFor(null)}>
          <Image src="/brand/logo.svg" alt="" width={758} height={512} className="site-logo" unoptimized />
          <span>From tap to trust.</span>
        </Link>
        <nav className="site-nav" aria-label="Hoofdnavigatie">
          {desktop.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className={href === "/testresultaten" ? "nav-personal" : undefined}>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && <button className="dock-backdrop" type="button" aria-label="Sluit het menu" tabIndex={-1} onClick={closeMenu} />}
      <div className="app-dock">
        <nav className="dock-tabs" aria-label="App-navigatie">
          {primary.map(([href, label, icon]) => (
            <Link className="dock-item" key={href} href={href}
              aria-current={pathname === href ? "page" : undefined} onClick={() => setOpenFor(null)}>
              <span className="dock-icon"><AppIcon name={icon} /></span>
              <span>{label}</span>
            </Link>
          ))}
          <button ref={toggle} type="button" className="dock-item dock-more" aria-controls="platform-nav"
            aria-expanded={isOpen} data-active={moreActive || undefined}
            onClick={() => setOpenFor(isOpen ? null : pathname)}>
            <span className="dock-icon"><AppIcon name="more" /></span>
            <span>Meer</span>
          </button>
        </nav>
        <div className={isOpen ? "nav-drawer is-open" : "nav-drawer"}>
          <nav id="platform-nav" className="more-links" aria-label="Meer pagina’s">
            {secondary.map(([href, label]) => (
              <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpenFor(null)}>
                {label}<AppIcon name="arrow" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
