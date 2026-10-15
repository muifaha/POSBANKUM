import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LAPOR POSBANKUM! - Layanan Pengaduan Pos Bantuan Hukum Kelurahan Mangunsari",
  description:
    "Layanan pengaduan dan konsultasi hukum terpercaya untuk warga Kelurahan Mangunsari. Aman, profesional, dan dapat diakses kapan saja.",
  icons: {
    icon: "/logo-posbankum-mangunsari.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased text-[#3C4A45] bg-[#FAFAF8] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
