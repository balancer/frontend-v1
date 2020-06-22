import Vue from 'vue';
import { proxies } from '@/helpers/utils';

const state = {
  init: false,
  loading: false,
  address: '',
  name: '',
  balances: {},
  pools: [],
  totalMarketcap: 0,
  totalVolume1Day: 0,
  sharesOwned: [],
  poolsById: {},
  proxy: ''
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
    await dispatch('getBalancer');
    await dispatch('getExchangeRatesFromCoinGecko');
    commit('SET', { loading: false, init: true });
  },
  getProxies: async ({ commit }, payload) => {
    const proxy = await proxies(payload || state.address);
    commit('SET', { proxy });
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
  }
};

export default {
  state,
  mutations,
  actions
};
