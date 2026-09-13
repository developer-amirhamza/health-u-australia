import ClientToaster from "./components/ClientToaster";
import FaqChatbot from "./components/FaqChatbot";
import FloatingContact from "./components/FloatingContact";
import Footer from "./components/Footer";
import { GoogleTranslateProvider, LanguageOption } from "./components/GoogleTranslateProvider";
import Header from "./components/Header";


const availableLanguages: LanguageOption[] = [
  { value: "en|en", label: "English" },
  { value: "en|zh-CN", label: "中文 (Mandarin)" },
  { value: "en|yue", label: "廣東話 (Cantonese)" },
  { value: "en|fr", label: "Français" },
  { value: "en|hi", label: "हिंदी" },
  { value: "en|bn", label: "বাংলা" },
  { value: "en|gu", label: "ગુજરાતી" },
  { value: "en|kn", label: "ಕನ್ನಡ" },
  { value: "en|ko", label: "한국어" },
  { value: "en|ml", label: "മലയാളം" },
  { value: "en|mr", label: "मराठी" },
  { value: "en|or", label: "ଓଡିଆ" },
  { value: "en|pa", label: "ਪੰਜਾਬੀ" },
  { value: "en|sd", label: "سنڌي" },
  { value: "en|ta", label: "தமிழ்" },
  { value: "en|te", label: "తెలుగు" },
  { value: "en|ur", label: "اردو" },
  { value: "en|vi", label: "Tiếng Việt" },
];



export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="relative flex mx-auto px-0 flex-col min-h-screen w-full" >
        <GoogleTranslateProvider pageLanguage="en" availableLanguages={availableLanguages}>
            <Header />
            {children}
            <Footer />
            <FloatingContact />
            <FaqChatbot />
            <ClientToaster />
        </GoogleTranslateProvider>
      </div>
  );
}