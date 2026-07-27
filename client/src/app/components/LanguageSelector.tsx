"use client";

import { useEffect, useRef, useState } from "react";
import { IoCaretDownSharp, IoCaretUpSharp } from "react-icons/io5";
import { useGoogleTranslate, LanguageOption } from "./GoogleTranslateProvider";

function getGoogTransCookie(): string | null {
  const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function LanguageSelector({
  buttonClassName = "",
}: {
  buttonClassName?: string;
}) {
  const { availableLanguages, changeLanguage } = useGoogleTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<LanguageOption>(availableLanguages[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Restore the previously chosen language on page load, e.g. "/en/hi" -> "hi"
    const targetLang = getGoogTransCookie()?.split("/")[2];
    const match = availableLanguages.find((lang) => lang.value.endsWith(`|${targetLang}`));
    if (match) setSelected(match);
  }, [availableLanguages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: LanguageOption) => {
    setSelected(lang);
    setIsOpen(false);
    changeLanguage(lang.value);
  };

  return (
    <div className="relative" ref={dropdownRef} translate="no">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 h-[34px] px-4 rounded text-sm font-semibold text-white transition-colors duration-200 ${buttonClassName}`}
      >
        <span>{selected.label}</span>
        {isOpen ? <IoCaretUpSharp size={12} /> : <IoCaretDownSharp size={12} />}
      </button>
      {isOpen && (
        <div className="absolute z-[999] left-0 mt-2 w-auto min-w-[140px] max-h-[220px] overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {availableLanguages.map((lang) => (
            <button
              type="button"
              key={lang.value}
              onClick={() => handleSelect(lang)}
              className={`block w-full text-left px-4 py-2 text-sm whitespace-nowrap hover:bg-blue-50 ${
                lang.value === selected.value ? "bg-blue-50 text-[#0078d4] font-medium" : "text-gray-700"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
