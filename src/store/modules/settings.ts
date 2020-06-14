import Vue from 'vue';
import provider from '@/helpers/provider';
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
    let hasProvider = false;
    commit('set', { loading: true });
    if (provider) {
      hasProvider = true;
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        dispatch('getBalancer');
        dispatch('getExchangeRatesFromCoinGecko');
        if (address) await dispatch('login');
      } catch (e) {
        console.log(e);
      }
    }
    commit('set', { loading: false, init: true, hasProvider });
  },
  login: async ({ commit, dispatch }) => {
    if (provider) {
      try {
        const ethereum = window['ethereum'];
        await ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await dispatch('getNetwork');
        const name = network.chainId === 1 ? await provider.lookupAddress(address) : '';
        await dispatch('getBalances', address);
        await dispatch('getProxies', address);
        commit('set', {
          name,
          address,
          loading: false
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch('notify', ['red', 'This website require MetaMask']);
    }
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
