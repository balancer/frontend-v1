import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Dashboard from '@/views/Dashboard.vue';
import Smart from '@/views/Smart.vue';
import Create from '@/views/Create.vue';
import Pool from '@/views/Pool.vue';
import PoolTokens from '@/views/Pool/Tokens.vue';
import PoolSwaps from '@/views/Pool/Swaps.vue';
import PoolShares from '@/views/Pool/Shares.vue';
import PoolAbout from '@/views/Pool/About.vue';
import PoolSettings from '@/views/Pool/Settings.vue';
import PoolActions from '@/views/Pool/Actions.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/explore/:tag', name: 'tag', component: Home },
  { path: '/', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/smart', name: 'smart', component: Smart },
  { path: '/pool/new', name: 'create', component: Create },
  {
    path: '/pool/:id',
    component: Pool,
    children: [
      { path: '', name: 'pool', component: PoolTokens },
      { path: 'swaps', name: 'pool-swaps', component: PoolSwaps },
      { path: 'shares', name: 'pool-shares', component: PoolShares },
      { path: 'about', name: 'pool-about', component: PoolAbout },
      { path: 'settings', name: 'pool-settings', component: PoolSettings },
      { path: 'actions', name: 'pool-actions', component: PoolActions }
    ]
  },
  { path: '/*', name: 'error-404', beforeEnter: (to, from, next) => next('/') }
];

const router = new VueRouter({
  routes
});

export default router;
