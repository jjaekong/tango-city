import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ReactNode } from "react";

interface LocaleContextType {
  language: string | null;
  supportedLanguages: string[];
  country: string | null;
  supportedCountries: {
    countryCode: string;
    countryName: string;
    countryNameEn: string;
  }[];
  setLanguage: (language: string) => void;
  setCountry: (country: string) => void;
}

export const LocaleContext = createContext<LocaleContextType | null>(null);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const isMounted = useRef<boolean | null>(false);
  const supportedLanguages = ["ko", "en", "es", "zh"];
  //   const supportedCountries = ["KR", "AR", "CN", "US"];
  const supportedCountries = [
    {
      countryCode: "KR",
      countryName: "대한민국",
      countryNameEn: "South Korea",
    },
    { countryCode: "AR", countryName: "Argentina", countryNameEn: "Argentina" },
    { countryCode: "CN", countryName: "中国", countryNameEn: "China" },
  ];
  const defaultCountryCode = "KR";
  const defaultLanguage = "ko";

  useEffect(() => {
    console.log("isMounted", isMounted.current);
    if (isMounted.current) return;

    // 로컬스토리지에서 각 설정을 가져옴
    const storedLanguage = localStorage.getItem("language");
    const storedCountry = localStorage.getItem("country");

    console.log("storedLanguage", storedLanguage);
    console.log("storedCountry", storedCountry);

    const regCountry = /[A-Z]{2}/;
    const regLanguage = /[a-z]{2}/;

    if (storedLanguage) {
      if (regLanguage.test(storedLanguage)) {
        if (supportedLanguages.includes(storedLanguage)) {
          setLanguage(storedLanguage);
        } else {
          setLanguage(defaultLanguage);
          localStorage.setItem("language", defaultLanguage);
        }
      } else {
        setLanguage(defaultLanguage);
        localStorage.setItem("language", defaultLanguage);
      }
    } else {
      const browserLanguage = navigator.language;
      const language = browserLanguage.split("-")[0]; // "en-US" -> "en"
      if (supportedLanguages.includes(language)) {
        setLanguage(language);
        localStorage.setItem("language", language);
      } else {
        setLanguage(defaultLanguage);
        localStorage.setItem("language", defaultLanguage);
      }
    }

    if (storedCountry) {
      if (regCountry.test(storedCountry)) {
        if (
          supportedCountries.some((item) => item.countryCode === storedCountry)
        ) {
          setCountry(storedCountry);
        } else {
          setCountry(defaultCountryCode);
          localStorage.setItem("country", defaultCountryCode);
        }
      } else {
        setCountry(defaultCountryCode);
        localStorage.setItem("country", defaultCountryCode);
      }
    } else {
      const browserLanguage = navigator.language;
      const country = browserLanguage.split("-")[1];
      if (
        supportedCountries.some((item) => item.countryCode === storedCountry)
      ) {
        setCountry(country);
        localStorage.setItem("country", country);
      } else {
        setCountry(defaultCountryCode);
        localStorage.setItem("country", defaultCountryCode);
      }
    }

    // 저장된
    return () => {
      isMounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (country) {
      if (supportedCountries.some((item) => item.countryCode === country)) {
        localStorage.setItem("country", country);
        return;
      }
    }
  }, [country]);

  return (
    <LocaleContext.Provider
      value={{
        language,
        supportedLanguages,
        country,
        supportedCountries,
        setLanguage,
        setCountry,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
