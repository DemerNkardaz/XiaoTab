import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

export function getBrowserLocale(supported: string[]) {
  const lang = navigator.language.toLowerCase().split('-')[0];
  return lang && supported.includes(lang) ? lang : 'en';
}

const supportedLocales = ['en', 'ru'];

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getBrowserLocale(supportedLocales),
  fallbackLocale: 'en',
  messages,
});
