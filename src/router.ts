import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Private from '@/views/Private.vue';
import MyPools from '@/views/MyPools.vue';
import Create from '@/views/Create.vue';
import Pool from '@/views/Pool.vue';
import PoolTokens from '@/views/Pool/Tokens.vue';
import PoolSwaps from '@/views/Pool/Swaps.vue';
import PoolHolders from '@/views/Pool/Holders.vue';
import PoolSettings from '@/views/Pool/Settings.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/private', name: 'private', component: Private },
  { path: '/my-pools', name: 'my-pools', component: MyPools },
  { path: '/create', name: 'create', component: Create },
  {
    path: '/pool/:id',
    component: Pool,
    children: [
      { path: '', name: 'pool', component: PoolTokens },
      { path: 'swaps', name: 'pool-swaps', component: PoolSwaps },
      { path: 'holders', name: 'pool-holders', component: PoolHolders },
      { path: 'settings', name: 'pool-settings', component: PoolSettings }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
