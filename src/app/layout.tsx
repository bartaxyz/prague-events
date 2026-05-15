import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prague Events",
  description: "Upcoming events in Prague from Luma",
  openGraph: {
    title: "Prague Events",
    description: "Upcoming events in Prague from Luma",
    siteName: "Prague Events",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
