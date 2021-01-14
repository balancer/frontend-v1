import Vue from 'vue';
import { getInstance } from '@snapshot-labs/lock/plugins/vue';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { Interface } from '@ethersproject/abi';
import store from '@/store';
import abi from '@/helpers/abi';
import config from '@/config';
import provider from '@/helpers/provider';
import wsProvider from '@/helpers/wsProvider';
import { multicall } from '@/_balancer/utils';

let auth;

if (wsProvider) {
  wsProvider.on('block', blockNumber => {
    store.commit('GET_BLOCK_SUCCESS', blockNumber);
  });
}

const state = {
  injectedLoaded: false,
  injectedChainId: null,
  blockNumber: 0,
  account: null,
  name: null,
  dsProxyAddress: null,
  active: false,
  balances: {},
  allowances: {},
  tokenMetadata: {}
};

const mutations = {
  LOGOUT(_state) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'injectedChainId', null);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'name', null);
    Vue.set(_state, 'dsProxyAddress', null);
    Vue.set(_state, 'active', false);
    Vue.set(_state, 'balances', {});
    Vue.set(_state, 'allowances', {});
    console.debug('LOGOUT');
  },
  LOAD_TOKEN_METADATA_REQUEST() {
    console.debug('LOAD_TOKEN_METADATA_REQUEST');
  },
  LOAD_TOKEN_METADATA_SUCCESS(_state, payload) {
    for (const address in payload) {
      Vue.set(_state.tokenMetadata, address, payload[address]);
    }
    console.debug('LOAD_TOKEN_METADATA_SUCCESS');
  },
  LOAD_TOKEN_METADATA_FAILURE(_state, payload) {
    console.debug('LOAD_TOKEN_METADATA_FAILURE', payload);
  },
  LOAD_WEB3_REQUEST() {
    console.debug('LOAD_WEB3_REQUEST');
  },
  LOAD_WEB3_SUCCESS() {
    console.debug('LOAD_WEB3_SUCCESS');
  },
  LOAD_WEB3_FAILURE(_state, payload) {
    console.debug('LOAD_WEB3_FAILURE', payload);
  },
  LOAD_PROVIDER_REQUEST() {
    console.debug('LOAD_PROVIDER_REQUEST');
  },
  LOAD_PROVIDER_SUCCESS(_state, payload) {
    Vue.set(_state, 'injectedLoaded', payload.injectedLoaded);
    Vue.set(_state, 'injectedChainId', payload.injectedChainId);
    Vue.set(_state, 'account', payload.account);
    Vue.set(_state, 'name', payload.name);
    Vue.set(_state, 'active', true);
    console.debug('LOAD_PROVIDER_SUCCESS');
  },
  LOAD_PROVIDER_FAILURE(_state, payload) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'injectedChainId', null);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'active', false);
    console.debug('LOAD_PROVIDER_FAILURE', payload);
  },
  GET_LATEST_BLOCK_REQUEST() {
    console.debug('GET_LATEST_BLOCK_REQUEST');
  },
  GET_LATEST_BLOCK_SUCCESS(_state, payload) {
    console.debug('GET_LATEST_BLOCK_SUCCESS', payload);
    Vue.set(_state, 'blockNumber', payload);
  },
  GET_LATEST_BLOCK_FAILURE() {
    console.debug('GET_LATEST_BLOCK_FAILURE');
  },
  HANDLE_CHAIN_CHANGED() {
    console.debug('HANDLE_CHAIN_CHANGED');
  },
  HANDLE_ACCOUNTS_CHANGED(_state, payload) {
    Vue.set(_state, 'account', payload);
    console.debug('HANDLE_ACCOUNTS_CHANGED', payload);
  },
  HANDLE_NETWORK_CHANGED() {
    console.debug('HANDLE_NETWORK_CHANGED');
  },
  HANDLE_DISCONNECT() {
    console.debug('HANDLE_DISCONNECT');
  },
  GET_BALANCES_REQUEST() {
    console.debug('GET_BALANCES_REQUEST');
  },
  GET_BALANCES_SUCCESS(_state, payload) {
    for (const address in payload) {
      Vue.set(_state.balances, address, payload[address]);
    }
    console.debug('GET_BALANCES_SUCCESS');
  },
  GET_BALANCES_FAILURE(_state, payload) {
    console.debug('GET_BALANCES_FAILURE', payload);
  },
  GET_ALLOWANCES_REQUEST() {
    console.debug('GET_ALLOWANCES_REQUEST');
  },
  GET_ALLOWANCES_SUCCESS(_state, payload) {
    for (const address in payload) {
      if (!_state.allowances.address) {
        Vue.set(_state.allowances, address, {});
      }
      for (const spender in payload[address]) {
        const allowance = payload[address][spender];
        Vue.set(_state.allowances[address], spender, allowance);
      }
    }
    console.debug('GET_ALLOWANCES_SUCCESS');
  },
  GET_ALLOWANCES_FAILURE(_state, payload) {
    console.debug('GET_ALLOWANCES_FAILURE', payload);
  },
  GET_PROXY_REQUEST() {
    console.debug('GET_PROXY_REQUEST');
  },
  GET_PROXY_SUCCESS(_state, payload) {
    const proxyAddress = payload === AddressZero ? '' : payload;
    Vue.set(_state, 'dsProxyAddress', proxyAddress);
    console.debug('GET_PROXY_SUCCESS');
  },
  GET_PROXY_FAILURE(_state, payload) {
    console.debug('GET_PROXY_FAILURE', payload);
  },
  GET_BLOCK_SUCCESS(_state, blockNumber) {
    Vue.set(_state, 'blockNumber', blockNumber);
    console.debug('GET_BLOCK_SUCCESS', blockNumber);
  }
};

const actions = {
  login: async ({ dispatch, commit }, connector = 'injected') => {
    commit('SET', { authLoading: true });
    auth = getInstance();
    await auth.login(connector);
    if (auth.provider) {
      auth.web3 = new Web3Provider(auth.provider);
      await dispatch('loadWeb3');
    }
    commit('SET', { authLoading: false });
  },
  logout: async ({ commit }) => {
    Vue.prototype.$auth.logout();
    commit('LOGOUT');
  },
  initTokenMetadata: async ({ commit }) => {
    const invalids = ['0xD46bA6D942050d489DBd938a2C909A5d5039A161'];
    const metadata = Object.fromEntries(
      Object.entries(config.tokens).map(tokenEntry => {
        const { decimals, symbol, name } = tokenEntry[1] as any;
        return [
          tokenEntry[0],
          {
            decimals,
            symbol,
            name,
            whitelisted: !invalids.includes(tokenEntry[0])
          }
        ];
      })
    );
    commit('LOAD_TOKEN_METADATA_SUCCESS', metadata);
  },
  loadTokenMetadata: async ({ commit }, tokens) => {
    commit('LOAD_TOKEN_METADATA_REQUEST');
    try {
      const keys = ['decimals', 'symbol', 'name'];
      const calls = tokens
        .map(token => keys.map(key => [token, key, []]))
        .reduce((a, b) => [...a, ...b]);
      const res = await multicall(provider, abi['TestToken'], calls);
      const tokenMetadata = Object.fromEntries(
        tokens.map((token, i) => [
          token,
          Object.fromEntries(
            keys.map((key, keyIndex) => [
              key,
              ...res[keyIndex + i * keys.length]
            ])
          )
        ])
      );
      commit('LOAD_TOKEN_METADATA_SUCCESS', tokenMetadata);
      return tokenMetadata;
    } catch (e) {
      commit('LOAD_TOKEN_METADATA_FAILURE', e);
      return Promise.reject();
    }
  },
  loadWeb3: async ({ commit, dispatch }) => {
    commit('LOAD_WEB3_REQUEST');
    try {
      if (auth.provider) await dispatch('loadProvider');
      if (state.injectedChainId === config.chainId) {
        await dispatch('loadAccount');
        await dispatch('checkPendingTransactions');
      }
      commit('LOAD_WEB3_SUCCESS');
    } catch (e) {
      commit('LOAD_WEB3_FAILURE', e);
      return Promise.reject();
    }
  },
  loadProvider: async ({ commit, dispatch }) => {
    commit('LOAD_PROVIDER_REQUEST');
    try {
      if (auth.provider.removeAllListeners) auth.provider.removeAllListeners();
      if (auth.provider && auth.provider.on) {
        auth.provider.on('accountsChanged', async accounts => {
          if (accounts.length === 0) {
            if (state.active) await dispatch('loadWeb3');
          } else {
            commit('HANDLE_ACCOUNTS_CHANGED', accounts[0]);
            await dispatch('clearUser');
            await dispatch('loadAccount');
          }
        });
        auth.provider.on('disconnect', async () => {
          commit('HANDLE_DISCONNECT');
          if (state.active) await dispatch('loadWeb3');
        });
        auth.provider.on('networkChanged', async () => {
          commit('HANDLE_NETWORK_CHANGED');
          if (state.active) {
            await dispatch('clearUser');
            await dispatch('logout');
            await dispatch('login');
          }
        });
      }
      const [network, accounts] = await Promise.all([
        auth.web3.getNetwork(),
        auth.web3.listAccounts()
      ]);
      const account = accounts.length > 0 ? accounts[0] : null;
      let name = '';
      if (config.chainId === 1) name = await provider.lookupAddress(account);
      commit('LOAD_PROVIDER_SUCCESS', {
        injectedLoaded: true,
        injectedChainId: network.chainId,
        account,
        name
      });
    } catch (e) {
      commit('LOAD_PROVIDER_FAILURE', e);
      return Promise.reject();
    }
  },
  loadAccount: async ({ dispatch }) => {
    if (!state.account) return;
    // @ts-ignore
    const tokens = Object.entries(config.tokens).map(token => token[1].address);
    await dispatch('getProxy');
    await Promise.all([
      dispatch('getBalances', tokens),
      dispatch('getAllowances', tokens),
      dispatch('getUserPoolShares')
    ]);
  },
  getPoolBalances: async (_state, { poolAddress, tokens }) => {
    const promises: any = [];
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      provider
    );
    const calls = [];
    const testToken = new Interface(abi.TestToken);
    const tokensToFetch = tokens
      ? tokens
      : Object.keys(state.balances).filter(token => token !== 'ether');
    tokensToFetch.forEach(token => {
      calls.push([
        // @ts-ignore
        token,
        // @ts-ignore
        testToken.encodeFunctionData('balanceOf', [poolAddress])
      ]);
    });
    promises.push(multi.aggregate(calls));
    const balances: any = {};
    try {
      // @ts-ignore
      const [[, response]] = await Promise.all(promises);
      let i = 0;
      response.forEach(value => {
        if (tokensToFetch && tokensToFetch[i]) {
          const balanceNumber = testToken.decodeFunctionResult(
            'balanceOf',
            value
          );
          balances[tokensToFetch[i]] = balanceNumber.toString();
        }
        i++;
      });
      return balances;
    } catch (e) {
      return Promise.reject();
    }
  },
  getBalances: async ({ commit }, tokens) => {
    commit('GET_BALANCES_REQUEST');
    const address = state.account;
    const promises: any = [];
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      provider
    );
    const calls = [];
    const testToken = new Interface(abi.TestToken);
    const tokensToFetch = tokens
      ? tokens
      : Object.keys(state.balances).filter(token => token !== 'ether');
    tokensToFetch.forEach(token => {
      // @ts-ignore
      calls.push([token, testToken.encodeFunctionData('balanceOf', [address])]);
    });
    promises.push(multi.aggregate(calls));
    promises.push(multi.getEthBalance(address));
    const balances: any = {};
    try {
      // @ts-ignore
      const [[, response], ethBalance] = await Promise.all(promises);
      // @ts-ignore
      balances.ether = ethBalance.toString();
      let i = 0;
      response.forEach(value => {
        if (tokensToFetch && tokensToFetch[i]) {
          const balanceNumber = testToken.decodeFunctionResult(
            'balanceOf',
            value
          );
          balances[tokensToFetch[i]] = balanceNumber.toString();
        }
        i++;
      });
      commit('GET_BALANCES_SUCCESS', balances);
      return balances;
    } catch (e) {
      commit('GET_BALANCES_FAILURE', e);
      return Promise.reject();
    }
  },
  getAllowances: async ({ commit }, tokens) => {
    commit('GET_ALLOWANCES_REQUEST');
    const spender: any = state.dsProxyAddress;
    if (!spender) return;
    const address = state.account;
    const promises: any = [];
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      provider
    );
    const calls = [];
    const testToken = new Interface(abi.TestToken);
    tokens.forEach(token => {
      calls.push([
        // @ts-ignore
        token,
        // @ts-ignore
        testToken.encodeFunctionData('allowance', [address, spender])
      ]);
    });
    promises.push(multi.aggregate(calls));
    const allowances: any = {};
    try {
      const [, response] = await multi.aggregate(calls);
      let i = 0;
      response.forEach(value => {
        if (tokens && tokens[i]) {
          const tokenAllowanceNumber = testToken.decodeFunctionResult(
            'allowance',
            value
          );
          if (!allowances[tokens[i]]) {
            allowances[tokens[i]] = {};
          }
          allowances[tokens[i]][spender] = tokenAllowanceNumber.toString();
        }
        i++;
      });
      commit('GET_ALLOWANCES_SUCCESS', allowances);
      return allowances;
    } catch (e) {
      commit('GET_ALLOWANCES_FAILURE', e);
      return Promise.reject();
    }
  },
  getProxy: async ({ commit }) => {
    commit('GET_PROXY_REQUEST');
    const address = state.account;
    try {
      const dsProxyRegistryContract = new Contract(
        config.addresses.dsProxyRegistry,
        abi['DSProxyRegistry'],
        provider
      );
      const proxy = await dsProxyRegistryContract.proxies(address);
      commit('GET_PROXY_SUCCESS', proxy);
      return proxy;
    } catch (e) {
      commit('GET_PROXY_FAILURE', e);
      return Promise.reject();
    }
  },
  getBlockNumber: async ({ commit }) => {
    try {
      const blockNumber = await provider.getBlockNumber();
      commit('GET_BLOCK_SUCCESS', blockNumber);
      return blockNumber;
    } catch (e) {
      return Promise.reject();
    }
  }
};

export default {
  state,
  mutations,
  actions
};
