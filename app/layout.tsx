import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "./_components/site-nav";
import { FooterWave } from "./_components/footer-wave";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "From Tap to Trust", template: "%s | From Tap to Trust" },
  description: "Ontdek waar je kraanwater vandaan komt, vind een tappunt en verken de thuistest.",
};

export const viewport: Viewport = { themeColor: "#edf2fd", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl">
      <body>
        <a className="skip-link" href="#inhoud">Direct naar inhoud</a>
        <SiteNav />
        <main id="inhoud" className="frame" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <FooterWave />
          <div className="frame footer-content">
            <Link href="/" className="footer-brand">
              <Image src="/brand/water-symbol.png" alt="" width={28} height={28} unoptimized />
              <span>From Tap to Trust</span>
            </Link>
            <nav className="footer-links" aria-label="Links onderaan">
              <Link href="/veelgestelde-vragen">Veelgestelde vragen</Link>
              <Link href="/bronnen">Bronnen</Link>
              <Link href="/contact">Iets mis? Neem contact op <span aria-hidden="true">↗</span></Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
