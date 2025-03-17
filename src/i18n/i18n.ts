import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import afTranslation from './locales/af/translation.json';
import enTranslation from './locales/en/translation.json';

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
