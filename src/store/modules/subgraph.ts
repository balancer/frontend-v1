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
  GET_POOL_REQUEST() {
    console.debug('GET_POOL_REQUEST');
  },
  GET_POOL_SUCCESS() {
    console.debug('GET_POOL_SUCCESS');
  },
  GET_POOL_FAILURE(_state, payload) {
    console.debug('GET_POOL_FAILURE', payload);
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
  GET_MY_POOLS_REQUEST() {
    console.debug('GET_MY_POOLS_REQUEST');
  },
  GET_MY_POOLS_SUCCESS(_state, payload) {
    Vue.set(_state, 'myPools', payload);
    console.debug('GET_MY_POOLS_SUCCESS');
  },
  GET_MY_POOLS_FAILURE(_state, payload) {
    console.debug('GET_MY_POOLS_FAILURE', payload);
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
  getPool: async ({ commit }, payload) => {
    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;
    const query = {
      pool: {
        __args: {
          id: payload.toLowerCase()
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
    commit('GET_POOL_REQUEST');
    try {
      let { pool } = await request('getPool', query);
      if (!pool) {
        return;
      }
      pool = formatPool(pool);
      commit('GET_POOL_SUCCESS');
      return pool;
    } catch (e) {
      commit('GET_POOL_FAILURE', e);
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
  getMyPools: async ({ commit }) => {
    commit('GET_MY_POOLS_REQUEST');
    try {
      const myPools = [
        '0x145bc933a22de9afd6f7a44d52e2cc9924b8741d',
        '0x1492b5b01350b7c867185a643f2e59f7be279fd3',
        '0x226bc733f8ce4cc76f2b13db1456d3724163a68f',
        '0xbe6daaf4ab70a1690759331aec740881620856f0',
        '0xe3bdae21c5afc2dd0d58bdc2324e5ac3c8801f40',
        '0x456a6019e548700f3ebd7d2afa5e2cca44e7c3c8'
      ];
      commit('GET_MY_POOLS_SUCCESS', myPools);
      return myPools;
    } catch (e) {
      commit('GET_MY_POOLS_FAILURE', e);
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
      const today = now - (now % (24 * 60 * 60 * 1000));
      const query = {};
      for (let i = 0; i < 31; i++) {
        const timestamp = today - i * day;
        query[`metrics_${timestamp}`] = {
          __aliasFor: 'swaps',
          __args: {
            first: 1,
            orderBy: 'timestamp',
            orderDirection: 'asc',
            where: {
              poolAddress: payload,
              timestamp_gt: timestamp / 1000
            }
          },
          poolTotalSwapVolume: true,
          poolTotalSwapFee: true
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
