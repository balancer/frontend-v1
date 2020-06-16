import Vue from 'vue';
// import provider from '@/helpers/provider';
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
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    commit('set', { loading: true });
    await dispatch('getBalancer');
    await dispatch('getExchangeRatesFromCoinGecko');
    commit('set', { loading: false, init: true });
  },
  login: async ({ dispatch }) => {
    await dispatch('loadWeb3Modal');
  },
  getSharesOwned: async ({ commit }, payload) => {
    const sharesOwned = await getSharesOwned(payload || state.address);
    commit('set', { sharesOwned });
  },
  getBalances: async ({ commit }, payload) => {
    const balances = await getBalances(payload || state.address);
    commit('set', { balances });
  },
  getProxies: async ({ commit }, payload) => {
    const proxy = await proxies(payload || state.address);
    commit('set', { proxy });
  },
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  }
};

export default {
  state,
  mutations,
  actions
};
