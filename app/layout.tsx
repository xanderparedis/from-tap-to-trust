import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "From Tap to Trust",
  description: "Een burgeronderzoek naar de smaak en geur van kraanwater.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
