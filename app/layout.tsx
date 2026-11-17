import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/auth-context";
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
  title: "TestMatch - Find Your Perfect Match",
  description:
    "ライブ配信と本音のトークで、本当に気の合う仲間と出会える場所、TestMatch。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <div className="h-full flex flex-col">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}