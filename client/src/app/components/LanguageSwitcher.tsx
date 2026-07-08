'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5';

// Define supported languages
const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current language from URL (default to 'en')
  const currentLocale = pathname?.split('/')[1] || 'en';
  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const switchLanguage = (newLocale: string) => {
    const segments = pathname?.split('/') || [];
    segments[1] = newLocale;
    const newPath = segments.join('/') || '/';
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1E3A8A] transition-colors rounded-lg hover:bg-gray-100"
      >
        <span>{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        {isOpen ? <IoCaretUpSharp size={14} /> : <IoCaretDownSharp size={14} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${
                currentLocale === lang.code ? 'bg-blue-50 text-[#1E3A8A] font-semibold' : 'text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {currentLocale === lang.code && (
                <span className="ml-auto text-[#1E3A8A]">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}