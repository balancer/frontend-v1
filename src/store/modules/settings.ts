import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
import provider from '@/helpers/provider';
import { getBalances, getSharesOwned, proxies } from '@/helpers/api';

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.commit('set', {
      network: ethers.utils.getNetwork(parseInt(network))
    });
  });
}

const state = {
  init: false,
  loading: false,
  address: '',
  name: '',
  balances: {},
  network: {},
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
    if (provider) {
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
    commit('set', { loading: false, init: true });
  },
  login: async ({ commit, dispatch }) => {
    if (provider) {
      try {
        await ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const name =
          network.chainId === 1 ? await provider.lookupAddress(address) : '';
        await dispatch('getBalances', address);
        await dispatch('getProxies', address);
        commit('set', {
          name,
          address,
          network,
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
