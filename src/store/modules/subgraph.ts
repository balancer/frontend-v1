import Vue from 'vue';
import { getAddress } from '@ethersproject/address';
import { request } from '@/helpers/subgraph';
import { formatPool, ITEMS_PER_PAGE } from '@/helpers/utils';

const state = {
  balancer: {},
  poolShares: {},
  myPools: [],
  tokens: {}
};

const mutations = {
  CLEAR_USER(_state) {
    Vue.set(_state, 'poolShares', {});
    Vue.set(_state, 'myPools', []);
    console.debug('CLEAR_USER');
  },
  GET_BALANCER_REQUEST() {
    console.debug('GET_BALANCER_REQUEST');
  },
  GET_BALANCER_SUCCESS(_state, payload) {
    Vue.set(_state, 'balancer', payload);
    console.debug('GET_BALANCER_SUCCESS');
  },
  GET_BALANCER_FAILURE(_state, payload) {
    console.debug('GET_BALANCER_FAILURE', payload);
  },
  GET_POOLS_REQUEST() {
    console.debug('GET_POOLS_REQUEST');
  },
  GET_POOLS_SUCCESS() {
    console.debug('GET_POOLS_SUCCESS');
  },
  GET_POOLS_FAILURE(_state, payload) {
    console.debug('GET_POOLS_FAILURE', payload);
  },
  GET_MY_POOLS_SHARES_REQUEST() {
    console.debug('GET_MY_POOLS_SHARES_REQUEST');
  },
  GET_MY_POOLS_SHARES_SUCCESS(_state, payload) {
    Vue.set(_state, 'poolShares', payload);
    console.debug('GET_MY_POOLS_SHARES_SUCCESS');
  },
  GET_MY_POOLS_SHARES_FAILURE(_state, payload) {
    console.debug('GET_MY_POOLS_SHARES_FAILURE', payload);
  },
  GET_POOLS_SWAPS_REQUEST() {
    console.debug('GET_POOLS_SWAPS_REQUEST');
  },
  GET_POOLS_SWAPS_SUCCESS() {
    console.debug('GET_POOLS_SWAPS_SUCCESS');
  },
  GET_POOLS_SWAPS_FAILURE(_state, payload) {
    console.debug('GET_POOLS_SWAPS_FAILURE', payload);
  },
  GET_POOLS_SHARES_REQUEST() {
    console.debug('GET_POOLS_SHARES_REQUEST');
  },
  GET_POOLS_SHARES_SUCCESS() {
    console.debug('GET_POOLS_SHARES_SUCCESS');
  },
  GET_POOLS_SHARES_FAILURE(_state, payload) {
    console.debug('GET_POOLS_SHARES_FAILURE', payload);
  },
  GET_POOLS_METRICS_REQUEST() {
    console.debug('GET_POOLS_METRICS_REQUEST');
  },
  GET_POOLS_METRICS_SUCCESS() {
    console.debug('GET_POOLS_METRICS_SUCCESS');
  },
  GET_POOLS_METRICS_FAILURE(_state, payload) {
    console.debug('GET_POOLS_METRICS_FAILURE', payload);
  },
  GET_TOKENS_REQUEST() {
    console.debug('GET_TOKEN_PRICES_REQUEST');
  },
  GET_TOKENS_SUCCESS(_state, payload) {
    Vue.set(_state, 'tokens', payload);
    console.debug('GET_TOKEN_PRICES_SUCCESS');
  },
  GET_TOKENS_FAILURE(_state, payload) {
    console.debug('GET_TOKEN_PRICES_FAILURE', payload);
  }
};

const actions = {
  getBalancer: async ({ commit }) => {
    commit('GET_BALANCER_REQUEST');
    try {
      const { balancer } = await request('getBalancer');
      balancer.privatePoolCount =
        balancer.poolCount - balancer.finalizedPoolCount;
      commit('GET_BALANCER_SUCCESS', balancer);
    } catch (e) {
      commit('GET_BALANCER_FAILURE', e);
    }
  },
  getPools: async ({ commit }, payload) => {
    const {
      first = ITEMS_PER_PAGE,
      page = 1,
      orderBy = 'liquidity',
      orderDirection = 'desc',
      where = {}
    } = payload;
    const skip = (page - 1) * first;
    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;
    where.tokensList_not = [];
    const query = {
      pools: {
        __args: {
          where,
          first,
          skip,
          orderBy,
          orderDirection
        },
        swaps: {
          __args: {
            where: {
              timestamp_lt: tsYesterday
            }
          }
        }
      }
    };
    commit('GET_POOLS_REQUEST');
    try {
      let { pools } = await request('getPools', query);
      pools = pools.map(pool => formatPool(pool));
      commit('GET_POOLS_SUCCESS');
      return pools;
    } catch (e) {
      commit('GET_POOLS_FAILURE', e);
    }
  },
  getMyPoolShares: async ({ commit, rootState }) => {
    const address = rootState.web3.account;
    commit('GET_MY_POOLS_SHARES_REQUEST');
    try {
      const query = {
        poolShares: {
          __args: {
            where: {
              userAddress: address.toLowerCase()
            }
          }
        }
      };
      const { poolShares } = await request('getMyPoolShares', query);
      const balances: any = {};
      poolShares.forEach(share => (balances[share.poolId.id] = share.balance));
      commit('GET_MY_POOLS_SHARES_SUCCESS', balances);
      return poolShares;
    } catch (e) {
      commit('GET_MY_POOLS_SHARES_FAILURE', e);
    }
  },
  getPoolSwaps: async ({ commit }, payload) => {
    commit('GET_POOLS_SWAPS_REQUEST');
    try {
      const {
        first = ITEMS_PER_PAGE,
        page = 1,
        orderBy = 'timestamp',
        orderDirection = 'desc',
        where = {}
      } = payload;
      const skip = (page - 1) * first;
      const query = {
        swaps: {
          __args: {
            where,
            first,
            skip,
            orderBy,
            orderDirection
          }
        }
      };
      const { swaps } = await request('getPoolSwaps', query);
      commit('GET_POOLS_SWAPS_SUCCESS');
      return swaps;
    } catch (e) {
      commit('GET_POOLS_SWAPS_FAILURE', e);
    }
  },
  getPoolShares: async ({ commit }, payload) => {
    commit('GET_POOLS_SHARES_REQUEST');
    try {
      const {
        first = ITEMS_PER_PAGE,
        page = 1,
        orderBy = 'balance',
        orderDirection = 'desc',
        where = {}
      } = payload;
      const skip = (page - 1) * first;
      const query = {
        poolShares: {
          __args: {
            where,
            first,
            skip,
            orderBy,
            orderDirection
          }
        }
      };
      const { poolShares } = await request('getPoolShares', query);
      commit('GET_POOLS_SHARES_SUCCESS');
      return poolShares;
    } catch (e) {
      commit('GET_POOLS_SHARES_FAILURE', e);
    }
  },
  getPoolMetrics: async ({ commit }, payload) => {
    commit('GET_POOLS_METRICS_REQUEST');
    try {
      const day = 24 * 60 * 60 * 1000;
      const now = Date.now();
      const today = now - (now % day);
      const query = {};
      for (let i = 0; i < 31; i++) {
        const timestamp = today - i * day;
        query[`metrics_${timestamp}`] = {
          __aliasFor: 'swaps',
          __args: {
            first: 1,
            orderBy: 'timestamp',
            orderDirection: 'desc',
            where: {
              poolAddress: payload,
              timestamp_gt: timestamp / 1000,
              timestamp_lt: (timestamp + day) / 1000
            }
          },
          poolTotalSwapVolume: true,
          poolTotalSwapFee: true,
          poolLiquidity: true
        };
      }
      const poolMetrics = await request('getPoolMetrics', query);
      commit('GET_POOLS_METRICS_SUCCESS');
      return poolMetrics;
    } catch (e) {
      commit('GET_POOLS_METRICS_FAILURE', e);
    }
  },
  getTokens: async ({ commit }) => {
    commit('GET_TOKENS_REQUEST');
    try {
      let { tokenPrices } = await request('getTokenPrices');
      tokenPrices = Object.fromEntries(
        tokenPrices
          .sort((a, b) => b.poolLiquidity - a.poolLiquidity)
          .map(tokenPrice => [
            getAddress(tokenPrice.id),
            parseFloat(tokenPrice.price)
          ])
      );
      commit('GET_TOKENS_SUCCESS', tokenPrices);
    } catch (e) {
      commit('GET_TOKENS_FAILURE', e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
