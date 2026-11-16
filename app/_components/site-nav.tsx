"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

const tabs = [
  ["/wat-is-nieuw", "Wat is nieuw?"],
  ["/mijn-water", "Herkomst"],
  ["/waterproblemen", "Waterproblemen"],
  ["/kaart", "Trusted by us"],
  ["/testresultaten", "Mijn tests"],
  ["/contact", "Contact"],
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [openFor, setOpenFor] = useState<string | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const isOpen = openFor === pathname;

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        setOpenFor(null);
        toggle.current?.focus();
      }
    }}>
      <div className="frame header-inner">
        <Link href="/" className="site-brand" onClick={() => setOpenFor(null)}>
          <Image src="/brand/logo.svg" alt="" width={758} height={512} className="site-logo" unoptimized />
          <span>From tap to trust.</span>
        </Link>
        <button ref={toggle} type="button" className="menu-toggle" aria-controls="platform-nav"
          aria-expanded={isOpen} onClick={() => setOpenFor(isOpen ? null : pathname)}>
          <span className="menu-icon" aria-hidden="true"><span /><span /></span>
          <span>{isOpen ? "Sluiten" : "Menu"}</span>
        </button>
        <div className={isOpen ? "nav-drawer is-open" : "nav-drawer"}>
          <div className="nav-drawer-inner">
            <nav id="platform-nav" className="site-nav" aria-label="Hoofdnavigatie">
              {tabs.map(([href, label]) => (
                <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
                  className={href === "/testresultaten" ? "nav-personal" : undefined} onClick={() => setOpenFor(null)}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
