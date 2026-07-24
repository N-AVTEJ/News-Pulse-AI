import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PulseProvider } from "@/context/PulseContext";
import AppShell from "@/components/AppShell";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewsPulse AI // Command Center",
  description: "Autonomous multi-agent news intelligence platform command center dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased bg-zinc-950 text-zinc-100">
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col antialiased bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30 overflow-hidden`}>
        <PulseProvider>
          <AppShell>
            {children}
          </AppShell>
        </PulseProvider>
      </body>
    </html>
  );
}
