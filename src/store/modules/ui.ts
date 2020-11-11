import Vue from 'vue';
import config from '@/config';
import registry from '@/_balancer/registry';

const state = {
  init: false,
  loading: false,
  authLoading: false,
  address: '',
  balances: {},
  pools: [],
  proxy: '',
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
    dispatch('loadFavorite');
    await Promise.all([
      registry.init(),
      dispatch('loadPricesById', tokenIds),
      dispatch('initTokenMetadata')
    ]);
    const connector = await Vue.prototype.$auth.getConnector();
    if (connector) dispatch('login', connector);
    commit('SET', { loading: false, init: true });
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
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
