import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteNav } from "./_components/site-nav";
import { FooterWave } from "./_components/footer-wave";
import { MascotHelper } from "./_components/mascot-helper";
import "./globals.css";
import "./_components/mascot-helper.css";

export const metadata: Metadata = {
  title: { default: "From Tap to Trust", template: "%s | From Tap to Trust" },
  description: "Discover where your tap water comes from, find a refill point and explore home testing.",
};

export const viewport: Viewport = { themeColor: "#edf2fd", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#inhoud">{"Skip to content"}</a>
        <SiteNav />
        <main id="inhoud" className="frame" tabIndex={-1}>{children}</main>
        <footer className="site-footer">
          <FooterWave />
          <div className="frame footer-content">
            <Link href="/" className="footer-brand">
              <Image src="/brand/water-symbol.png" alt="" width={28} height={28} unoptimized />
              <span>From Tap to Trust</span>
            </Link>
            <nav className="footer-links" aria-label={"Footer links"}>
              <Link href="/veelgestelde-vragen">{"Frequently asked questions"}</Link>
              <Link href="/bronnen">{"Sources"}</Link>
              <Link href="/contact">{"Something wrong? Get in touch "}<span aria-hidden="true">↗</span></Link>
            </nav>
          </div>
        </footer>
        <MascotHelper />
      </body>
    </html>
  );
}
