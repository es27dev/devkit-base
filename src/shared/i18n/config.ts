// External Libraries
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Common Translations
import commonDe from "./locales/de.json";

// Page Translations
import pagesDe from "@/pages/i18n/locales/de.json";
import aboutDe from "@/pages/about/i18n/locales/de.json";

// Feature Translations
import themeToggleDe from "@/components/features/theme-toggle/i18n/locales/de.json";
import contactFormDe from "@/components/features/contact-form/i18n/locales/de.json";
import applicationFormDe from "@/components/features/application-form/i18n/locales/de.json";
import jobFilterDe from "@/components/features/job-filter/i18n/locales/de.json";

// Jobs Translations
import jobsDe from "@/shared/i18n/jobs/de.json";

// Merge all translations into one flat object
const mergedDe = {
  ...commonDe,
  ...pagesDe,
  ...aboutDe,
  ...themeToggleDe,
  ...contactFormDe,
  ...applicationFormDe,
  ...jobFilterDe,
  ...jobsDe,
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
