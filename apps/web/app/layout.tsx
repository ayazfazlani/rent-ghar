import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import { AuthProvider } from "@/context/auth-context";
import StructuredData from "@/components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://rentghar.com'),
  title: {
    default: "PropertyDealer - Property Portal Pakistan",
    template: "%s | PropertyDealer"
  },
  description: "Pakistan's most trusted property portal since 2007. Find properties for rent and sale in Multan, Lahore, Karachi, and Islamabad.",
  keywords: ["property portal pakistan", "Property Dealer", "houses for rent multan", "apartments for sale lahore", "plots karachi", "commercial property islamabad"],
  authors: [{ name: "PropertyDealer Team" }],
  creator: "PropertyDealer",
  publisher: "PropertyDealer",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://rentghar.com',
    siteName: 'PropertyDealer',
    title: 'PropertyDealer - Find Your Dream Property in Pakistan',
    description: "Explore thousands of properties for rent and sale across Pakistan.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PropertyDealer Property Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PropertyDealer - Property Portal Pakistan',
    description: 'Find properties for rent and sale in Pakistan.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            <TooltipProvider>
              <StructuredData />
              {children}
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}