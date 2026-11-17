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
  ["/waterproblemen", "Waterproblemen"],
  ["/#nieuwsbrief", "Nieuwsbrief"],
  ["/contact", "Contact"],
  ["/bronnen", "Bronnen"],
] as const;

type Menu = "desktop" | "mobile";

export function SiteNav() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<{ pathname: string; menu: Menu } | null>(null);
  const desktopToggle = useRef<HTMLButtonElement>(null);
  const mobileToggle = useRef<HTMLButtonElement>(null);
  const openMenu = openFor?.pathname === pathname ? openFor.menu : null;
  const moreActive = secondary.some(([href]) => href === pathname);

  function toggleMenu(menu: Menu) {
    setOpenFor(openMenu === menu ? null : { pathname, menu });
  }

  function closeMenu() {
    setOpenFor(null);
    (openMenu === "desktop" ? desktopToggle : mobileToggle).current?.focus();
  }

  const moreLinks = secondary.map(([href, label]) => (
    <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}
      onClick={() => setOpenFor(null)}>
      {label}<AppIcon name="arrow" />
    </Link>
  ));

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && openMenu) {
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
          {primary.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className={href === "/testresultaten" ? "nav-personal" : undefined}
              onClick={() => setOpenFor(null)}>
              {href === "/kaart" ? "Trusted by us" : label}
            </Link>
          ))}
          <button ref={desktopToggle} type="button" className="desktop-more" aria-controls="desktop-more-links"
            aria-expanded={openMenu === "desktop"} data-active={moreActive || undefined}
            onClick={() => toggleMenu("desktop")}>Meer <span className="menu-chevron" aria-hidden="true" /></button>
          <div inert={openMenu !== "desktop"} className={openMenu === "desktop" ? "desktop-drawer is-open" : "desktop-drawer"}>
            <div id="desktop-more-links" className="more-links">{moreLinks}</div>
          </div>
        </nav>
      </div>

      {openMenu && (
        <button className={"menu-backdrop menu-backdrop-" + openMenu} type="button"
          aria-label="Sluit het menu" tabIndex={-1} onClick={closeMenu} />
      )}
      <div className="app-dock">
        <nav className="dock-tabs" aria-label="App-navigatie">
          {primary.map(([href, label, icon]) => (
            <Link className="dock-item" key={href} href={href}
              aria-current={pathname === href ? "page" : undefined} onClick={() => setOpenFor(null)}>
              <span className="dock-icon"><AppIcon name={icon} /></span>
              <span>{label}</span>
            </Link>
          ))}
          <button ref={mobileToggle} type="button" className="dock-item dock-more" aria-controls="platform-nav"
            aria-expanded={openMenu === "mobile"} data-active={moreActive || undefined}
            onClick={() => toggleMenu("mobile")}>
            <span className="dock-icon"><AppIcon name="more" /></span>
            <span>Meer</span>
          </button>
        </nav>
        <div inert={openMenu !== "mobile"} className={openMenu === "mobile" ? "nav-drawer is-open" : "nav-drawer"}>
          <nav id="platform-nav" className="more-links" aria-label="Meer pagina’s">{moreLinks}</nav>
        </div>
      </div>
    </header>
  );
}
