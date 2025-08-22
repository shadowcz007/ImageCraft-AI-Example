import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImageCraft AI - AI Image Generation",
  description: "Create stunning images with AI-powered image generation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
