import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en/translation.json';
import afTranslation from './locales/af/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already safes from XSS
        },
        resources: {
            en: {
                translation: enTranslation
            },
            af: {
                translation: afTranslation
            }
        }
    });

export default i18n;
