import { getProfile } from '3box';

const state = {
  profiles: {}
};

const mutations = {
  GET_PROFILE_REQUEST() {
    console.log('GET_PROFILE_REQUEST');
  },
  GET_PROFILE_SUCCESS(_state, payload) {
    state[payload.address] = payload.profile;
    console.log('GET_PROFILE_SUCCESS', payload);
  },
  GET_PROFILE_FAILURE(_state, payload) {
    console.log('GET_PROFILE_FAILURE', payload);
  }
};

const actions = {
  getProfile: async ({ commit }, address) => {
    commit('GET_PROFILE_REQUEST');
    try {
      const profile = await getProfile(address);
      commit('GET_PROFILE_SUCCESS', { address, profile });
      return profile;
    } catch (e) {
      commit('GET_PROFILE_FAILURE', e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
