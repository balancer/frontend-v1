import Vue from 'vue';
import config from '@/config';
import { getLists } from '@/_balancer/explore';

const state = {
  init: false,
  loading: false,
  authLoading: false,
  address: '',
  balances: {},
  pools: [],
  proxy: '',
  sidebarIsOpen: false
};

const mutations = {
  SET(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    commit('SET', { loading: true });
    const tokenIds = Object.keys(config.tokens)
      .map(tokenAddress => config.tokens[tokenAddress].id)
      .filter(tokenId => !!tokenId);
    dispatch('loadFavorite');
    const [lists] = await Promise.all([
      getLists(),
      dispatch('loadPricesById', tokenIds),
      dispatch('initTokenMetadata')
    ]);
    const connector = await Vue.prototype.$auth.getConnector();
    if (connector) dispatch('login', connector);
    commit('SET', { loading: false, init: true, lists });
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
  },
  toggleSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: !state.sidebarIsOpen });
  },
  hideSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: false });
  }
};

export default {
  state,
  mutations,
  actions
};
