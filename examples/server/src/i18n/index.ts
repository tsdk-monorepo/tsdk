import 'intl-pluralrules';
import i18next, { i18n as I18n } from 'i18next';

import helloJSON from './index.json';

const translation = helloJSON;
export const i18n: I18n = i18next.createInstance(
  {
    fallbackLng: 'en',
    debug: true,
    ns: ['translation'],
    resources: {
      en: {
        translation,
      },
      'zh-TW': {
        translation: {
          hello: '您好世界',
        },
      },
    },
  },
  (err, t) => {
    if (err) return console.log('something went wrong loading', err);
  }
);

// i18n.addResource
// i18n.addResources
// i18n.addResourceBundle

// i18n.t('hello');

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'translation';
    // custom resources type
    resources: {
      translation: typeof translation;
    };
    // other
  }
}
