import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
import provider from '@/helpers/provider';

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => {
    store.commit('ACCOUNTS_CHANGED');
    store.dispatch('init');
  });
  ethereum.on('networkChanged', networkId => {
    const network = ethers.utils.getNetwork(parseInt(networkId));
    store.commit('NETWORK_CHANGED', network);
  });
}

const state = {
  chainId: 0,
  name: '',
  ensAddress: ''
};

const mutations = {
  GET_NETWORK_REQUEST() {
    console.log('GET_NETWORK_REQUEST');
  },
  GET_NETWORK_SUCCESS(_state, payload) {
    Vue.set(_state, 'chainId', payload.chainId);
    Vue.set(_state, 'name', payload.name);
    Vue.set(_state, 'ensAddress', payload.ensAddress);
    console.log('GET_NETWORK_SUCCESS', payload);
  },
  GET_NETWORK_FAILURE(_state, payload) {
    console.log('GET_NETWORK_FAILURE', payload);
  },
  ACCOUNTS_CHANGED() {
    console.log('ACCOUNTS_CHANGED');
  },
  NETWORK_CHANGED(_state, payload) {
    Vue.set(_state, 'chainId', payload.chainId);
    Vue.set(_state, 'name', payload.name);
    Vue.set(_state, 'ensAddress', payload.ensAddress);
    console.log('NETWORK_CHANGED', payload);
  }
};

const actions = {
  getNetwork: async ({ commit }) => {
    commit('GET_NETWORK_REQUEST');
    try {
      const network = await provider.getNetwork();
      commit('GET_NETWORK_SUCCESS', network);
      return network;
    } catch (e) {
      commit('GET_BALANCER_FAILURE', e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
