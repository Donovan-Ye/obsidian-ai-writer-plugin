import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ENtranslation from './recourses/en/translation.json'
import zhHanstranslation from './recourses/zh/translation.json'

const resources = {
  zh: {
    translation: zhHanstranslation,
  },
  en: {
    translation: ENtranslation,
  },
}

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: getObsidianLanguageCode(),
})

export default i18n

// should be the same as Obsidian's language setting
// copied from https://github.com/obsidianmd/obsidian-translations?tab=readme-ov-file#existing-languages
export const languageMap = new Map([
  ['en', 'English'],
  ['zh', '简体中文'],
  ['zh-TW', '繁體中文'],
  ['am', 'አማርኛ'],
  ['be', 'беларуская мова'],
  ['cs', 'čeština'],
  ['da', 'Dansk'],
  ['de', 'Deutsch'],
  ['es', 'Español'],
  ['fa', 'فارسی'],
  ['fr', 'français'],
  ['id', 'Bahasa Indonesia'],
  ['it', 'Italiano'],
  ['ja', '日本語'],
  ['ko', '한국어'],
  ['nl', 'Nederlands'],
  ['no', 'Norsk'],
  ['pl', 'język polski'],
  ['pt', 'Português'],
  ['pt-BR', 'Portugues do Brasil'],
  ['ru', 'Русский'],
  ['sq', 'Shqip'],
  ['th', 'ไทย'],
  ['tr', 'Türkçe'],
  ['vi', 'Tiếng Việt'],
])

// Obsidian will store language setting in localStorage
// when the language is English, it will not be stored, so we need to provide a default value
export function getObsidianLanguageCode() {
  return localStorage.getItem('language') ?? 'en'
}
export function getNativeLanguage(languageCode: string) {
  return languageMap.get(languageCode) ?? languageCode
}

export function getObsidianNativeLanguage() {
  return getNativeLanguage(getObsidianLanguageCode())
}
