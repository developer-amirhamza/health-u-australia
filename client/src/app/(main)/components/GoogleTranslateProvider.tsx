"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import Script from "next/script";

export interface LanguageOption {
  /** "<sourceLangCode>|<targetLangCode>", e.g. "en|hi" */
  value: string;
  label: string;
}

interface GoogleTranslateContextType {
  changeLanguage: (langValue: string) => void;
  availableLanguages: LanguageOption[];
}

const GoogleTranslateContext = createContext<GoogleTranslateContextType | null>(null);

const DEFAULT_LANGUAGES: LanguageOption[] = [{ value: "en|en", label: "English" }];

declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          elementId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

function selectGoogleTranslateCombo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

function fireChangeEvent(select: HTMLSelectElement) {
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

export function GoogleTranslateProvider({
  children,
  pageLanguage = "en",
  availableLanguages = DEFAULT_LANGUAGES,
}: {
  children: ReactNode;
  pageLanguage?: string;
  availableLanguages?: LanguageOption[];
}) {
  useEffect(() => {
    const styleId = "google-translate-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #google_translate_element {
        display: none !important;
      }
      .goog-te-banner-frame,
      .goog-te-menu-frame,
      .goog-te-balloon-frame,
      .skiptranslate {
        display: none !important;
      }
      body {
        top: 0 !important;
      }
      .goog-text-highlight {
        background: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const changeLanguage = (langValue: string) => {
    const targetLang = langValue.split("|")[1];
    const select = selectGoogleTranslateCombo();
    if (!select) {
      // Google's widget can still be loading on first click; retry shortly.
      setTimeout(() => {
        const retry = selectGoogleTranslateCombo();
        if (retry) {
          retry.value = targetLang;
          fireChangeEvent(retry);
        }
      }, 300);
      return;
    }
    select.value = targetLang;
    fireChangeEvent(select);
  };

  return (
    <GoogleTranslateContext.Provider value={{ changeLanguage, availableLanguages }}>
      <div id="google_translate_element" />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({ pageLanguage: '${pageLanguage}', autoDisplay: false }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      {children}
    </GoogleTranslateContext.Provider>
  );
}

export function useGoogleTranslate() {
  const context = useContext(GoogleTranslateContext);
  if (!context) {
    throw new Error("useGoogleTranslate must be used within a GoogleTranslateProvider");
  }
  return context;
}
