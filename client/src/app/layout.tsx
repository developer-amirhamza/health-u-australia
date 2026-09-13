import ScrollToTopBtn from "utils/ScrollToTopBtn";

import "./styles/globals.css"
import ScrollToTop from "utils/ScrollToTop";
import { ReduxProvider } from "./redux/provider";


export const metadata = {
  metadataBase: new URL("https://healthuau.com.au"),
  title: {
    default: "Health U Australia - NDIS Service Provider",
    template: "%s | Health U Australia",
  },
  description: "NDIS support provider in Sydney helping participants live independently with tailored SIL, support coordination and care services.",
  openGraph: {
    title: "Health U Australia - NDIS Service Provider",
    description: "NDIS support provider in Sydney helping participants live independently with tailored SIL, support coordination and care services.",
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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="google-site-verification" content="oQduANhC4p2tTm9WVBh4u6G4YPVV7ZBkPvxHL7MMXMg" />
      </head>
      <body className="relative flex mx-auto px-0 flex-col min-h-screen w-full" suppressHydrationWarning>
          <ReduxProvider>
            {children}
            <ScrollToTop />
            <ScrollToTopBtn />
          </ReduxProvider>
      </body>
    </html>
  );
}