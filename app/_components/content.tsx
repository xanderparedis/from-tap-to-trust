import Link from "next/link";
import type { ReactNode } from "react";

export function Intro({ section, title, children }: { section: string; title: string; children: ReactNode }) {
  return (
    <header className="page-intro">
      <p className="section-label">{section}</p>
      <h1>{title}</h1>
      <div className="intro-text">{children}</div>
    </header>
  );
}

export function NextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="text-link" href={href}>{children} <span aria-hidden="true">↗</span></Link>;
}
