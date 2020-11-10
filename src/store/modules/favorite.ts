import Vue from 'vue';
import omit from 'lodash/omit';
import { lsSet, lsGet } from '@/helpers/localStorage';

const FAVORITES_KEY = 'favorites-pools';

const state = {
  favorites: {}
};

const mutations = {
  setFavorites(_state, favorites: Record<string, boolean>) {
    Vue.set(_state, 'favorites', favorites);
  }
};

const actions = {
  loadFavorite({ commit }) {
    const favorites = lsGet(FAVORITES_KEY) || {};
    commit('setFavorites', favorites);
  },
  addFavorite({ commit, state }, id: string) {
    const favorites = { ...state.favorites, [id]: true };
    lsSet(FAVORITES_KEY, favorites);
    commit('setFavorites', favorites);
  },
  removeFavorite({ commit, state }, id: string) {
    const favorites = omit(state.favorites, id);
    lsSet(FAVORITES_KEY, favorites);
    commit('setFavorites', favorites);
  }
};

export default {
  state,
  mutations,
  actions
};
