
import ScrollToTopBtn from "utils/ScrollToTopBtn";
import Footer from "./components/Footer";
import Header from "./components/Header";
import "./styles/globals.css"
import ScrollToTop from "utils/ScrollToTop";

export const metadata = {
  metadataBase: new URL("https://healthuau.com.au"),
  title: {
    default: "Health U Australia",
    template: "%s | Health U Support Services",
  },
  description: "NDIS support providers committed to enhancing your health and well-being by assisting you according to your preferences and enabling you to live independently",
  openGraph: {
    title: "Health U Support Services",
    description: "NDIS support providers committed to enhancing your health and well-being by assisting you according to your preferences and enabling you to live independently",
    url: "https://healthuau.com.au",
    siteName: "Health U Australia",
    images: [
      {
        url: "https://healthuau.com.au/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className="relative flex flex-col h-full w-full" suppressHydrationWarning>
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
        <ScrollToTopBtn />
      </body>
    </html>
  )
}