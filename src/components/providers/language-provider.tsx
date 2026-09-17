"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { SupportedLanguage } from "@/lib/ai/context";
import { SITE_I18N } from "@/lib/data/site-i18n";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: typeof SITE_I18N["en"];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: SITE_I18N.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("naadabrahma_lang") as SupportedLanguage | null;
      if (stored && ["en", "te", "hi", "ta", "kn", "ml"].includes(stored)) {
        setLanguageState(stored);
      }
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("naadabrahma_lang", lang);
    }
  };

  const t = SITE_I18N[language] || SITE_I18N.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
