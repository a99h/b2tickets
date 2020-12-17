import en from '../translations/en'
import ru from '../translations/ru'

export default {
  // current locale
  locale: 'ru',

  // when translation is not available fallback to that locale
  fallbackLocale: 'en',

  // availabled locales for user selection
  availableLocales: [{
    code: 'en',
    flag: 'us',
    label: 'English',
    messages: en
  },
  //   {
  //   code: 'es',
  //   flag: 'es',
  //   label: 'Español',
  //   messages: es
  // }, {
  //   code: 'pt',
  //   flag: 'pt',
  //   label: 'Português',
  //   messages: pt
  // }, {
  //   code: 'de',
  //   flag: 'de',
  //   label: 'Deutsche',
  //   messages: de
  // }, {
  //   code: 'fr',
  //   flag: 'fr',
  //   label: 'Français',
  //   messages: fr
  // },
  {
    code: 'ru',
    flag: 'ru',
    label: 'Русский',
    messages: ru
  }]
}
