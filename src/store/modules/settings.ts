import Vue from 'vue';
import { getBalances, getSharesOwned, proxies } from '@/helpers/api';

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
  login: async ({ dispatch }) => {
    await dispatch('loadWeb3Modal');
  },
  getSharesOwned: async ({ commit }, payload) => {
    const sharesOwned = await getSharesOwned(payload || state.address);
    commit('SET', { sharesOwned });
  },
  getBalances: async ({ commit }, payload) => {
    const balances = await getBalances(payload || state.address);
    commit('SET', { balances });
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
