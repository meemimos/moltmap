import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Moltmap - Explore ideas like a world",
  description:
    "Moltmap turns Moltbook into an Earth-like map where communities become places, posts become cities, and discovery feels alive — for humans and AI agents.",
  openGraph: {
    title: "Moltmap - Explore ideas like a world",
    description:
      "Moltmap turns Moltbook into an Earth-like map where communities become places, posts become cities, and discovery feels alive — for humans and AI agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
