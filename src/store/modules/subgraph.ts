import Vue from 'vue';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { query } from '@/helpers/subgraph';
import { formatPool } from '@/helpers/utils';
import config from '@/helpers/config';
import queries from '@/helpers/queries.json';

const state = {
  balancer: {},
  myPools: []
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
  },
  GET_MY_POOLS_REQUEST() {
    console.log('GET_MY_POOLS_REQUEST');
  },
  GET_MY_POOLS_SUCCESS(_state, payload) {
    Vue.set(_state, 'myPools', payload);
    console.log('GET_MY_POOLS_SUCCESS');
  },
  GET_MY_POOLS_FAILURE(_state, payload) {
    console.log('GET_MY_POOLS_FAILURE', payload);
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
    const q = queries['getPool'];
    q.pool.__args = { id: payload };
    const gqlQuery = jsonToGraphQLQuery({ query: q }, { pretty: true });
    commit('GET_POOL_REQUEST');
    try {
      let { pool } = await query(config.subgraphUrl, gqlQuery);
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
    const skip = (page - 1) * first;
    const ts = Math.round(new Date().getTime() / 1000);
    const tsYesterday = ts - 24 * 3600;
    const q = queries['getPools'];
    where.tokensList_not = [];
    // @ts-ignore
    q.pools.__args = {
      where,
      first,
      skip,
      orderBy,
      orderDirection
    };
    // @ts-ignore
    q.pools.swaps.__args = {
      where: {
        timestamp_gt: tsYesterday
      }
    };
    const gqlQuery = jsonToGraphQLQuery({ query: q }, { pretty: true });
    commit('GET_POOLS_REQUEST');
    try {
      let { pools } = await query(config.subgraphUrl, gqlQuery);
      pools = pools.map(pool => formatPool(pool));
      commit('GET_POOLS_SUCCESS');
      return pools;
    } catch (e) {
      commit('GET_POOLS_FAILURE', e);
    }
  },
  getMyPools: async ({ commit, dispatch }) => {
    commit('GET_MY_POOLS_REQUEST');
    try {
      const query = {
        first: 3,
        where: {
          id_in: [
            '0xbe6daaf4ab70a1690759331aec740881620856f0',
            '0xe3bdae21c5afc2dd0d58bdc2324e5ac3c8801f40',
            '0x456a6019e548700f3ebd7d2afa5e2cca44e7c3c8'
          ]
        }
      };
      const myPools = await dispatch('getPools', query);
      commit('GET_MY_POOLS_SUCCESS', myPools);
      return myPools;
    } catch (e) {
      commit('GET_MY_POOLS_FAILURE', e);
    }
  }
};

export default {
  state,
  mutations,
  actions
};
