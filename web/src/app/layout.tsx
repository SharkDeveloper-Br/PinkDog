import type { Metadata } from "next";
import { Space_Grotesk, Bebas_Neue, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-body" });
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-title" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Pink Dog — Clínica Veterinária & Pet Care",
  description: "Veterinária afetiva, estética canina e cuidados felinos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${spaceGrotesk.variable} ${bebasNeue.variable} ${jetbrains.variable}`}>
      <body className="font-body bg-[#FAF5EC] text-[#161616]">{children}</body>
    </html>
  );
}
