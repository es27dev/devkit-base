// External Libraries
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Common Translations
import commonDe from "./locales/de.json";

// Component Translations
import productFeatureDe from "@/components/features/product-feature/i18n/locales/de.json";

// Page Translations
import pagesDe from "@/pages/i18n/locales/de.json";

// Merge all translations into one flat object
const mergedDe = {
  ...commonDe,
  ...productFeatureDe,
  ...pagesDe,
};

i18n.use(initReactI18next).init({
  resources: {
    de: {
      translation: mergedDe, // Single merged translation object
    },
  },
  lng: "de",
  fallbackLng: "de",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
