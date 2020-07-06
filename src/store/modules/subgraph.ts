import Vue from 'vue';
import { request } from '@/helpers/subgraph';
import { formatPool } from '@/helpers/utils';

const state = {
  balancer: {},
  poolShares: {},
  myPools: [],
  tokenPrices: {}
};

const getters = {
  getPrice: state => (token, amount) => {
    const tokenPrice = state.tokenPrices[token.toLowerCase()];
    if (!tokenPrice) return 0;
    return tokenPrice.price * amount;
  }
};

const mutations = {
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
  GET_TOKEN_PRICES_REQUEST() {
    console.debug('GET_TOKEN_PRICES_REQUEST');
  },
  GET_TOKEN_PRICES_SUCCESS(_state, payload) {
    Vue.set(_state, 'tokenPrices', payload);
    console.debug('GET_TOKEN_PRICES_SUCCESS');
  },
  GET_TOKEN_PRICES_FAILURE(_state, payload) {
    console.debug('GET_TOKEN_PRICES_FAILURE', payload);
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
  GET_PRICE_HISTORY_REQUEST() {
    console.debug('GET_PRICE_HISTORY_REQUEST');
  },
  GET_PRICE_HISTORY_SUCCESS() {
    console.debug('GET_PRICE_HISTORY_SUCCESS');
  },
  GET_PRICE_HISTORY_FAILURE(_state, payload) {
    console.debug('GET_PRICE_HISTORY_FAILURE', payload);
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
  getTokenPrices: async ({ commit }) => {
    commit('GET_TOKEN_PRICES_REQUEST');
    try {
      let { tokenPrices } = await request('getTokenPrices');
      tokenPrices = Object.fromEntries(
        tokenPrices
          .sort((a, b) => b.poolLiquidity - a.poolLiquidity)
          .map(tokenPrice => [tokenPrice.id, tokenPrice])
      );
      commit('GET_TOKEN_PRICES_SUCCESS', tokenPrices);
    } catch (e) {
      commit('GET_TOKEN_PRICES_FAILURE', e);
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
      pool = formatPool(pool);
      commit('GET_POOL_SUCCESS');
      return pool;
    } catch (e) {
      commit('GET_POOL_FAILURE', e);
    }
  },
  getPools: async ({ commit }, payload) => {
    const {
      first = 10,
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
      poolShares.forEach(
        share => (balances[share.poolId.id] = parseFloat(share.balance))
      );
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
        first = 10,
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
        first = 10,
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
  getPriceHistory: async ({ commit }) => {
    commit('GET_PRICE_HISTORY_REQUEST');
    try {
      let query = '{';
      const ids = ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'];
      const days = 10;
      for (let i = 0; i < days; i++) {
        query += `
        _${i}: tokenPrices (
          where: {
            id_in: ${JSON.stringify(ids)}
          }
        ) {
          id
          price
          symbol
        }`;
      }
      query += '}';
      const priceHistory = await request(null, query);
      commit('GET_PRICE_HISTORY_SUCCESS');
      return priceHistory;
    } catch (e) {
      commit('GET_PRICE_HISTORY_FAILURE', e);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
