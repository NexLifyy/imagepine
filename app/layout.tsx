import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import PrivacyBanner from "@/components/PrivacyBanner";
import Footer from "@/components/Footer";
import EmailPopup from "@/components/EmailPopup";
import PwaRegister from "@/components/PwaRegister";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "ImagePine",
  title: "ImagePine – Resize, Compress, Convert & Edit Images Online",
  description:
    "Free online image editor. Resize, compress, rotate, flip and convert images instantly in your browser. No upload needed - 100% private.",
  keywords: "image resizer, image compressor, rotate image, flip image, free image editor online",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    siteName: "ImagePine",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA & Mobile Meta */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7342E6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ImagePine" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Grow by Mediavine */}
        <script
          data-grow-initializer=""
          dangerouslySetInnerHTML={{
            __html: `!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTo0N2IyM2M4YS1mMWZmLTRkOTgtODE4OC1hYjZmNjQ4NDc3Mjk=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();`,
          }}
        />

        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4627499924394267"
          crossOrigin="anonymous"
        />
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K17SPE0RN6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-K17SPE0RN6');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          background: "#F7F7FB",
        }}
      >
        <LanguageProvider>
          <PwaRegister />
          <Navbar />
          <PrivacyBanner />
          <EmailPopup />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}

