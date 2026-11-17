import Link from "next/link";
import type { ReactNode } from "react";
import { MascotSlot } from "./mascot-slot";

export function Intro({ section, title, children }: { section: string; title: string; children: ReactNode }) {
  return (
    <header className="page-intro">
      <div className="page-intro-top">
        <p className="section-label">{section}</p>
        <MascotSlot slot="paginas" />
      </div>
      <h1>{title}</h1>
      <div className="intro-text">{children}</div>
    </header>
  );
}

export function NextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="text-link" href={href}>{children} <span aria-hidden="true">↗</span></Link>;
}
