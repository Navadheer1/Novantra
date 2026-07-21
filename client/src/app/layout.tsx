import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noventra | Startup Ecosystem",
  description: "A professional startup ecosystem for Founders, VCs, and Users.",
};

import { FeedProvider } from "@/context/FeedContext";
import { ConnectionProvider } from "@/components/ConnectionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <ConnectionProvider>
            <FeedProvider>{children}</FeedProvider>
          </ConnectionProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
