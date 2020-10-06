import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/locales/index.ts';
import fr from '@/locales/index.ts';
import de from '@/locales/index.ts';
import es from '@/locales/index.ts';
import pt from '@/locales/index.ts';
import ko from '@/locales/index.ts';
import zh from '@/locales/index.ts';

Vue.use(VueI18n);

const locale = 'en-US';

export default new VueI18n({
  locale,
  messages: {
      en,
      fr,
      de,
      es,
      pt,
      ko,
      zh
  },
  dateTimeFormats: {
    'en-US': {
      short: {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric'
      },
      long: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }
    }
  }
});
