import type { Metadata, Viewport } from "next";
import { Rubik, Golos_Text } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/parts";

const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin", "cyrillic"], weight: ["500", "700", "800"], display: "swap" });
const golos = Golos_Text({ variable: "--font-golos", subsets: ["latin", "cyrillic"], weight: ["400", "600"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Кирпичик за кирпичиком — история LEGO", template: "%s — Кирпичик за кирпичиком" },
  description: "Фан-сайт об истории LEGO: от столярной мастерской в Биллунне 1932 года до наборов на 12 060 деталей. Каждый факт — с источником.",
  openGraph: { title: "Кирпичик за кирпичиком", description: "История LEGO как инструкция по сборке.", locale: "ru_RU", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dce6ee" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

// Runs before first paint: picks the theme (saved choice, else system) and flags whether motion is allowed.
const bootScript = `(()=>{try{var d=document.documentElement,s=localStorage.getItem("theme");if(s==="dark"||(!s&&matchMedia("(prefers-color-scheme: dark)").matches))d.classList.add("dark");}catch(e){}if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion-ok");})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${rubik.variable} ${golos.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:font-semibold">
          Перейти к содержанию
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
