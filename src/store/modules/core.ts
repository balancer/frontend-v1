import Vue from 'vue';
import { joinPool, exitPool } from '@/helpers/api';

const state = {};

const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  joinPool: async (
    { commit },
    { poolAddress, poolAmountOut, maxAmountsIn }
  ) => {
    await joinPool(poolAddress, poolAmountOut, maxAmountsIn);
  },
  exitPool: async (
    { commit },
    { poolAddress, poolAmountIn, minAmountsOut }
  ) => {
    await exitPool(poolAddress, poolAmountIn, minAmountsOut);
  }
};

export default {
  state,
  mutations,
  actions
};
