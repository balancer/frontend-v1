import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const locale = 'en-US';

export default new VueI18n({
  locale,
  messages: {
    'en-US': {
      message: {
        hello: 'hello!!',
        plural:
          'You have {n, plural, =0{no messages} one{1 message} other{# messages}}.',
        select:
          '{gender, select, male{He} female{She} other{They}} liked this.',
        number: 'Current Percent: {current, number, percent}',
        time: 'Current Time: {current, time, short}'
      }
    },
    'ja-JP': {
      message: {
        hello: 'こんにちは！！',
        select:
          '{gender, select, male{彼} female{彼女} other{彼ら}} はこれを好きです。',
        number: '現在パーセンテージ {current, number, percent}',
        time: '現在時刻: {current, time, medium}'
      }
    }
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      },
      price: {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 3
      }
    }
  }
});
