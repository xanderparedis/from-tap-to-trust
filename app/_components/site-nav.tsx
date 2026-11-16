"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const isOpen = openFor === pathname;

  return (
    <header className="site-header">
      <div className="frame header-inner">
        <Link href="/" className="site-brand" onClick={() => setOpenFor(null)}>
          <Image src="/brand/logo.svg" alt="" width={758} height={512} className="site-logo" unoptimized />
          <span>From tap to trust.</span>
        </Link>
        <button type="button" className="menu-toggle" aria-controls="platform-nav"
          aria-expanded={isOpen} onClick={() => setOpenFor(isOpen ? null : pathname)}>
          {isOpen ? "Sluiten" : "Menu"}
        </button>
        <nav id="platform-nav" className={isOpen ? "site-nav is-open" : "site-nav"} aria-label="Hoofdnavigatie">
          {tabs.map(([href, label]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className={href === "/testresultaten" ? "nav-personal" : undefined} onClick={() => setOpenFor(null)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
