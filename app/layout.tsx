import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blaze — Know if the sky is worth the summit",
  description:
    "Hiking-focused sunrise and sunset quality forecasting. Tells you whether the sky will actually be worth the summit effort.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0b1120",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
