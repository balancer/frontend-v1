import Vue from 'vue';
import config from '@/config';
import { multicall } from '@/_balancer/utils';
import provider from '@/helpers/provider';
import abi from '@/helpers/abi';

const state = {
  init: false,
  loading: false,
  authLoading: false,
  address: '',
  balances: {},
  pools: [],
  proxy: '',
  sidebarIsOpen: false,
  modalOpen: false
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
    await Promise.all([
      dispatch('loadPricesById', tokenIds),
      dispatch('initTokenMetadata'),
      dispatch('getBlockNumber')
    ]);
    const connector = await Vue.prototype.$auth.getConnector();
    if (connector) dispatch('login', connector);
    commit('SET', { loading: false, init: true });

    try {
      const result = await multicall(provider, abi['Vault'], [
        [
          '0xBFa16D136bAFEa5a54f581C491be040BA44AF98F',
          'getPoolTokens',
          ['0x369f6f4116813e3e3f79fabe3444a7c41e716f8f000200000000000000000000']
        ]
      ]);
      console.log('Pool tokens', result);
    } catch (e) {
      console.log(e);
    }
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
  },
  toggleSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: !state.sidebarIsOpen });
  },
  hideSidebar: ({ commit }) => {
    commit('SET', { sidebarIsOpen: false });
  },
  toggleModal: ({ commit }) => {
    commit('SET', { modalOpen: !state.modalOpen });
  }
};

export default {
  state,
  mutations,
  actions
};
