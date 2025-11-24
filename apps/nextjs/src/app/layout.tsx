import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/ui/theme";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/react";
import { Geist, Geist_Mono } from "geist/font";

import "@/app/globals.css";

import { env } from "@/config/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Menuplanner",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Menuplanner",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://menuplanner.vercel.app",
    siteName: "Menuplanner",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bvanremortele",
    creator: "@bvanremortele",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({ variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono" });

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground min-h-screen font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
