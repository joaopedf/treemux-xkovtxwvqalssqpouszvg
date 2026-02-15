import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoiceClip - Create Viral Audio Moments with AI",
  description: "AI-powered platform for creating viral-worthy audio clips instantly. Use trending prompts, AI enhancement, and multiple voice styles for TikTok/Instagram-ready content.",
  keywords: ["AI", "voice generation", "TTS", "viral audio", "content creation", "TikTok", "Instagram"],
  authors: [{ name: "johnny" }],
  openGraph: {
    title: "VoiceClip - Create Viral Audio Moments with AI",
    description: "Create viral-worthy audio clips with AI-powered voice generation",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
