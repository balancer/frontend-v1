import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
import provider from '@/helpers/provider';
import {
  getBalances,
  getPool,
  getPoolsWithMarket,
  getSharesOwned
} from '@/helpers/api';

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
  loading: false,
  address: '',
  name: '',
  balances: {},
  network: {},
  pools: [],
  totalMarketcap: 0,
  totalVolume1Day: 0,
  sharesOwned: [],
  poolsById: {}
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
    const pools = await getPoolsWithMarket();
    const totalMarketcap = pools.reduce((a, b) => a + b.marketcap, 0);
    const totalVolume1Day = pools.reduce((a, b) => a + b.volume1Day, 0);
    if (provider) {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        if (address) await dispatch('login');
      } catch (e) {
        console.log(e);
      }
    }
    commit('set', { loading: false });
    commit('set', { pools, totalMarketcap, totalVolume1Day, loading: false });
  },
  login: async ({ commit, dispatch }) => {
    if (provider) {
      try {
        await ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const name = await provider.lookupAddress(address);
        // const balance = await provider.getBalance(address);
        await dispatch('getBalances', address);
        const network = await provider.getNetwork();
        commit('set', {
          name,
          address,
          // balance: ethers.utils.formatEther(balance),
          network,
          loading: false
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('This website require MetaMask');
    }
  },
  getPool: async ({ commit }, payload) => {
    const pool = await getPool(payload);
    const poolsById = state.poolsById;
    poolsById[pool.id] = pool;
    commit('set', { poolsById });
  },
  getSharesOwned: async ({ commit }, payload) => {
    const sharesOwned = await getSharesOwned(payload || state.address);
    commit('set', { sharesOwned });
  },
  getBalances: async ({ commit }, payload) => {
    const balances = await getBalances(payload || state.address);
    commit('set', { balances });
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
