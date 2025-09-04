/* eslint-disable import/no-extraneous-dependencies */
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-xhr-backend'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    whitelist: [
      'en',
      'jp',
      'vn',
      'id',
      'th',
      'my',
      'sw',
      'fr',
      'hi',
      'te',
      'bn',
      'ta',
      'gu',
      'pa',
      'ph',
    ],
    debug: false,

    // have a common namespace used around the full app
    ns: ['translation'],
    defaultNS: 'translation',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      useSuspense: true,
    },
  })

export default i18n
