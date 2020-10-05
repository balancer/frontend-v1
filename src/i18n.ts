import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/locales/en-US.json';
import fr from '@/locales/fr-FR.json';
import de from '@/locales/de-DE.json';
import es from '@/locales/es-ES.json';
import pt from '@/locales/pt-BR.json';
import ko from '@/locales/ko-KR.json';
import zh from '@/locales/zh-CN.json';

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
