import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "../contexts/LanguageContext";
import Script from "next/script";
import ClientAdSense from "../components/ClientAdSense";

const inter = Inter({ subsets: ["latin"] });

// Window tipini AdSense için genişletelim
declare global {
  interface Window {
    adsbygoogle: Array<any> & {
      pauseAdRequests?: number;
      push: (...args: any[]) => void;
    };
    dataLayer: any[];
  }
}

export const metadata: Metadata = {
  title: "TurboReader - Hızlı Okuma Platformu",
  description: "TurboReader ile metinlerinizi 3 kat daha hızlı okuyun ve anlama gücünüzü artırın. Ücretsiz hızlı okuma teknolojisi.",
  keywords: "hızlı okuma, speed reading, ebook reader, metin okuma, okuma hızı, TurboReader, hızlı okuma uygulaması, okuma tekniği",
  openGraph: {
    title: "TurboReader - Hızlı Okuma Platformu",
    description: "Metinlerinizi 3 kat daha hızlı okuyun ve anlama gücünüzü artırın.",
    url: "https://turboreader.com",
    siteName: "TurboReader",
    images: [
      {
        url: "/images/turbo-logo.png",
        width: 600,
        height: 180,
        alt: "TurboReader Logo",
      }
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TurboReader - Hızlı Okuma Platformu",
    description: "Metinlerinizi 3 kat daha hızlı okuyun ve anlama gücünüzü artırın.",
    images: ["/images/turbo-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  icons: {
    icon: '/images/turbo-logo.png',
    shortcut: '/images/turbo-logo.png',
    apple: '/images/turbo-logo.png',
  },
  category: 'education',
  creator: 'TurboReader Team',
  publisher: 'TurboReader',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning className="dark">
      <head>
        <link rel="canonical" href="https://turboreader.com" />
        {/* Google Analytics için script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body suppressHydrationWarning className={`${inter.className} bg-gray-900 text-white transition-colors duration-200`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {/* Client tarafında çalışan AdSense başlatıcı */}
        <ClientAdSense />
      </body>
    </html>
  );
}
