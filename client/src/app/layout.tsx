import ScrollToTopBtn from "utils/ScrollToTopBtn";
import Footer from "./components/Footer";
import Header from "./components/Header";
import FloatingContact from "./components/FloatingContact";
import FaqChatbot from "./components/FaqChatbot";
import "./styles/globals.css"
import ScrollToTop from "utils/ScrollToTop";
import { GoogleTranslateProvider, LanguageOption } from './components/GoogleTranslateProvider';

const availableLanguages: LanguageOption[] = [
  { value: "en|en", label: "English" },
  { value: "en|zh-CN", label: "中文 (Mandarin)" },
  { value: "en|yue", label: "廣東話 (Cantonese)" },
  { value: "en|hi", label: "हिंदी" },
  { value: "en|bn", label: "বাংলা" },
  { value: "en|gu", label: "ગુજરાતી" },
  { value: "en|kn", label: "ಕನ್ನಡ" },
  { value: "en|ml", label: "മലയാളം" },
  { value: "en|mr", label: "मराठी" },
  { value: "en|or", label: "ଓଡିଆ" },
  { value: "en|pa", label: "ਪੰਜਾਬੀ" },
  { value: "en|sd", label: "سنڌي" },
  { value: "en|ta", label: "தமிழ்" },
  { value: "en|te", label: "తెలుగు" },
  { value: "en|ur", label: "اردو" },
];

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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="google-site-verification" content="oQduANhC4p2tTm9WVBh4u6G4YPVV7ZBkPvxHL7MMXMg" />
      </head>
      <body className="relative flex mx-auto px-0 flex-col min-h-screen w-full" suppressHydrationWarning>
        <GoogleTranslateProvider pageLanguage="en" availableLanguages={availableLanguages}>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <ScrollToTopBtn />
          <FloatingContact />
          <FaqChatbot />
        </GoogleTranslateProvider>
      </body>
    </html>
  );
}