import Vue from 'vue';
import config from '@/config';

const state = {
  init: false,
  authLoading: false,
  loading: false,
  address: '',
  balances: {},
  pools: [],
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
      dispatch('initTokenMetadata')
    ]);
    const connector = await Vue.prototype.$auth.getConnector();
    if (connector) {
      commit('SET', { authLoading: true });
      dispatch('login', connector).then(() =>
        commit('SET', { authLoading: false })
      );
    }
    commit('SET', { loading: false, init: true });
  },
  loading: ({ commit }, payload) => {
    commit('SET', { loading: payload });
  },
  toggleModal: ({ commit }) => {
    commit('SET', { modalOpen: !state.modalOpen });
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
