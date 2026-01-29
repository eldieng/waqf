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
  title: "Waqf And Liggeyal Daara",
  description: "Plateforme de dons pour l'Association Waqf And Liggeyal Daara",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png', type: 'image/png' },
    ],
    apple: '/img/VF-LOGO-WAQF-AND-LIGGEYAL-DAARA.png',
    shortcut: '/favicon.png',
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
