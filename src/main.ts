import Vue from 'vue';
import VueUi from '@vue/ui';
import infiniteScroll from 'vue-infinite-scroll';
import Jazzicon from 'vue-jazzicon';
import { upperFirst, camelCase } from 'lodash';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { shorten, trunc } from '@/helpers/utils';
import mixins from '@/mixins';
import i18n from '@/i18n';
import '@/style.scss';

Vue.use(VueUi);
Vue.use(infiniteScroll);

const requireComponent = require.context('@/components', true, /[\w-]+\.vue$/);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  );
  Vue.component(componentName, componentConfig.default || componentConfig);
});

Vue.component('jazzicon', Jazzicon);

Vue.filter('shorten', value => shorten(value));
Vue.filter('trunc', (value, decimals) => trunc(value, decimals));

Vue.mixin(mixins);

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
