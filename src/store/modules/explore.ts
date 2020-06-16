import Vue from 'vue';
import { query } from '@/helpers/subgraph';
import { formatPool } from '@/helpers/utils';
import config from '@/helpers/config';

const state = {
  balancer: {}
};

const mutations = {
  GET_BALANCER_REQUEST() {
    console.log('GET_BALANCER_REQUEST');
  },
  GET_BALANCER_SUCCESS(_state, payload) {
    Vue.set(_state, 'balancer', payload);
    console.log('GET_BALANCER_SUCCESS');
  },
  GET_BALANCER_FAILURE(_state, payload) {
    console.log('GET_BALANCER_FAILURE', payload);
  },
  GET_POOL_REQUEST() {
    console.log('GET_POOL_REQUEST');
  },
  GET_POOL_SUCCESS() {
    console.log('GET_POOL_SUCCESS');
  },
  GET_POOL_FAILURE(_state, payload) {
    console.log('GET_POOL_FAILURE', payload);
  },
  GET_POOLS_REQUEST() {
    console.log('GET_POOLS_REQUEST');
  },
  GET_POOLS_SUCCESS() {
    console.log('GET_POOLS_SUCCESS');
  },
  GET_POOLS_FAILURE(_state, payload) {
    console.log('GET_POOLS_FAILURE', payload);
  }
};

const actions = {
  getBalancer: async ({ commit }) => {
    const q = `{
      balancer(id: 1) {
        id
        color
        poolCount
        finalizedPoolCount
        txCount
      }
    }`;
    commit('GET_BALANCER_REQUEST');
    try {
      const { balancer } = await query(config.subgraphUrl, q);
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
    const q = `{
      pool (id: "${payload}") {
        id
        publicSwap
        finalized
        swapFee
        totalWeight
        totalShares
        tokensList
        tokens (orderBy: denormWeight, orderDirection: desc) {
          id
          name
          address
          balance
          decimals
          symbol
          denormWeight
        }
        shares (where: { balance_gt: 0 }) {
          id
          poolId {
            id
          }
          userAddress {
            id
          }
          balance
        }
        swaps (where: { timestamp_gt: ${tsYesterday} }) {
          tokenIn
          tokenInSym
          tokenAmountIn
          tokenOut
          tokenOutSym
          tokenAmountOut
        }
      }
    }`;
    commit('GET_POOL_REQUEST');
    try {
      let { pool } = await query(config.subgraphUrl, q);
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
      orderBy = 'totalEthValue',
      orderDirection = 'desc',
      where = {}
    } = payload;
    let whereStr = 'tokensList_not: []';
    if (Object.keys(where).length > 0)
      Object.entries(where).forEach(
        row => (whereStr += `, ${row[0]}: ${row[1]}`)
      );
    const skip = (page - 1) * first;
    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;
    const q = `{
      pools (
        first: ${first}, 
        skip: ${skip},
        where: { ${whereStr} },
        orderBy: ${orderBy}, 
        orderDirection: ${orderDirection}
      ) {
        id
        publicSwap
        finalized
        swapFee
        totalWeight
        totalShares
        totalEthValue
        tokensList
        tokens (orderBy: denormWeight, orderDirection: desc) {
          id
          address
          balance
          decimals
          symbol
          denormWeight
        }
        shares (where: { balance_gt: 0 }) {
          id
          poolId {
            id
          }
          userAddress {
            id
          }
          balance
        }
        swaps (where: { timestamp_gt: ${tsYesterday} }) {
          tokenIn
          tokenInSym
          tokenAmountIn
          tokenOut
          tokenOutSym
          tokenAmountOut
        }
      }
    }`;
    commit('GET_POOLS_REQUEST');
    try {
      let { pools } = await query(config.subgraphUrl, q);
      pools = pools.map(pool => formatPool(pool));
      commit('GET_POOLS_SUCCESS');
      return pools;
    } catch (e) {
      commit('GET_POOLS_FAILURE', e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
