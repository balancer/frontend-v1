import Vue from 'vue';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { Interface } from '@ethersproject/abi';
import abi from '@/helpers/abi';
import config from '@/helpers/config';
import lock from '@/helpers/lock';
import wsProvider from '@/helpers/ws';
import { lsSet, lsGet, lsRemove, isTxRejected } from '@/helpers/utils';

const GAS_LIMIT_BUFFER = 0.1;

let provider;
let web3;

const state = {
  injectedLoaded: false,
  injectedChainId: null,
  account: null,
  dsProxyAddress: null,
  name: null,
  active: false,
  balances: {},
  allowances: {},
  tokenMetadata: {}
};

const getters = {
  hasProxy: state => {
    const proxyAddress = state.dsProxyAddress;
    return !!proxyAddress && proxyAddress !== AddressZero;
  }
};

const mutations = {
  LOGOUT(_state) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'injectedChainId', null);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'dsProxyAddress', null);
    Vue.set(_state, 'name', null);
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
  LOAD_BACKUP_PROVIDER_REQUEST() {
    console.debug('LOAD_BACKUP_PROVIDER_REQUEST');
  },
  LOAD_BACKUP_PROVIDER_SUCCESS(_state, payload) {
    console.debug('LOAD_BACKUP_PROVIDER_SUCCESS', payload);
    Vue.set(_state, 'active', true);
  },
  LOAD_BACKUP_PROVIDER_FAILURE(_state, payload) {
    Vue.set(_state, 'backUpLoaded', false);
    Vue.set(_state, 'activeChainId', null);
    Vue.set(_state, 'active', false);
    console.debug('LOAD_BACKUP_PROVIDER_FAILURE', payload);
  },
  HANDLE_CHAIN_CHANGED() {
    console.debug('HANDLE_CHAIN_CHANGED');
  },
  HANDLE_ACCOUNTS_CHANGED(_state, payload) {
    Vue.set(_state, 'account', payload);
    console.debug('HANDLE_ACCOUNTS_CHANGED', payload);
  },
  HANDLE_CLOSE_CHANGED() {
    console.debug('HANDLE_CLOSE_CHANGED');
  },
  HANDLE_NETWORK_CHANGED() {
    console.debug('HANDLE_NETWORK_CHANGED');
  },
  LOOKUP_ADDRESS_REQUEST() {
    console.debug('LOOKUP_ADDRESS_REQUEST');
  },
  LOOKUP_ADDRESS_SUCCESS(_state, payload) {
    Vue.set(_state, 'name', payload);
    console.debug('LOOKUP_ADDRESS_SUCCESS');
  },
  LOOKUP_ADDRESS_FAILURE(_state, payload) {
    console.debug('LOOKUP_ADDRESS_FAILURE', payload);
  },
  RESOLVE_NAME_REQUEST() {
    console.debug('RESOLVE_NAME_REQUEST');
  },
  RESOLVE_NAME_SUCCESS() {
    console.debug('RESOLVE_NAME_SUCCESS');
  },
  RESOLVE_NAME_FAILURE(_state, payload) {
    console.debug('RESOLVE_NAME_FAILURE', payload);
  },
  SEND_TRANSACTION_REQUEST() {
    console.debug('SEND_TRANSACTION_REQUEST');
  },
  SEND_TRANSACTION_SUCCESS() {
    console.debug('SEND_TRANSACTION_SUCCESS');
  },
  SEND_TRANSACTION_REJECTED(_state, payload) {
    console.debug('SEND_TRANSACTION_REJECTED', payload);
  },
  SEND_TRANSACTION_FAILURE(_state, payload) {
    console.debug('SEND_TRANSACTION_FAILURE', payload);
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
    Vue.set(_state, 'dsProxyAddress', payload);
    console.debug('GET_PROXY_SUCCESS');
  },
  GET_PROXY_FAILURE(_state, payload) {
    console.debug('GET_PROXY_FAILURE', payload);
  }
};

const actions = {
  login: async ({ dispatch }, connector = 'injected') => {
    const lockConnector = lock.getConnector(connector);
    provider = await lockConnector.connect();
    if (provider) {
      web3 = new Web3Provider(provider);
      await dispatch('loadWeb3');
      if (state.account) lsSet('connector', connector);
    }
  },
  logout: async ({ commit }) => {
    const connector = lsGet('connector');
    if (connector) {
      const lockConnector = lock.getConnector(connector);
      await lockConnector.logout();
      lsRemove('connector');
    }
    commit('LOGOUT');
    commit('CLEAR_USER');
  },
  initTokenMetadata: async ({ commit }) => {
    const metadata = Object.fromEntries(
      Object.entries(config.tokens).map(tokenEntry => {
        const { decimals, symbol } = tokenEntry[1] as any;
        return [
          tokenEntry[0],
          {
            decimals,
            symbol,
            whitelisted: true
          }
        ];
      })
    );
    commit('LOAD_TOKEN_METADATA_SUCCESS', metadata);
  },
  loadTokenMetadata: async ({ commit }, tokens) => {
    commit('LOAD_TOKEN_METADATA_REQUEST');
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      web3
    );
    const calls = [];
    const testToken = new Interface(abi.TestToken);
    tokens.forEach(token => {
      // @ts-ignore
      calls.push([token, testToken.encodeFunctionData('decimals', [])]);
      // @ts-ignore
      calls.push([token, testToken.encodeFunctionData('symbol', [])]);
    });
    const tokenMetadata: any = {};
    try {
      const [, response] = await multi.aggregate(calls);
      for (let i = 0; i < tokens.length; i++) {
        const [decimals] = testToken.decodeFunctionResult(
          'decimals',
          response[0]
        );
        const [symbol] = testToken.decodeFunctionResult('symbol', response[1]);
        tokenMetadata[tokens[i]] = {
          decimals,
          symbol
        };
      }
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
      if (!web3 || !provider) {
        await dispatch('loadBackupProvider');
      } else {
        await dispatch('loadProvider');
        if (!state.injectedLoaded || state.injectedChainId !== config.chainId) {
          await dispatch('loadBackupProvider');
        }
      }
      await dispatch('loadAccount');
      commit('LOAD_WEB3_SUCCESS');
    } catch (e) {
      commit('LOAD_WEB3_FAILURE', e);
      return Promise.reject();
    }
  },
  loadProvider: async ({ commit, dispatch }) => {
    commit('LOAD_PROVIDER_REQUEST');
    try {
      if (provider.removeAllListeners) provider.removeAllListeners();
      if (provider && provider.on) {
        provider.on('chainChanged', async () => {
          commit('HANDLE_CHAIN_CHANGED');
          if (state.active) {
            await dispatch('logout');
            await dispatch('login');
          }
        });
        provider.on('accountsChanged', async accounts => {
          if (accounts.length === 0) {
            if (state.active) await dispatch('loadWeb3');
          } else {
            commit('HANDLE_ACCOUNTS_CHANGED', accounts[0]);
            await dispatch('loadAccount');
          }
        });
        provider.on('close', async () => {
          commit('HANDLE_CLOSE');
          if (state.active) await dispatch('loadWeb3');
        });
        provider.on('networkChanged', async () => {
          commit('HANDLE_NETWORK_CHANGED');
          if (state.active) {
            await dispatch('logout');
            await dispatch('login');
          }
        });
      }
      const network = await web3.getNetwork();
      const accounts = await web3.listAccounts();
      const account = accounts.length > 0 ? accounts[0] : null;
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
  loadBackupProvider: async ({ commit }) => {
    commit('LOAD_BACKUP_PROVIDER_REQUEST');
    try {
      web3 = wsProvider;
      provider = null;
      const network = await web3.getNetwork();
      commit('LOAD_BACKUP_PROVIDER_SUCCESS', {
        injectedActive: false,
        backUpLoaded: true,
        account: null,
        activeChainId: network.chainId
      });
    } catch (e) {
      commit('LOAD_BACKUP_PROVIDER_FAILURE', e);
      return Promise.reject();
    }
  },
  lookupAddress: async ({ commit }) => {
    commit('LOOKUP_ADDRESS_REQUEST');
    try {
      const name = await web3.lookupAddress(state.account);
      commit('LOOKUP_ADDRESS_SUCCESS', name);
      return name;
    } catch (e) {
      commit('LOOKUP_ADDRESS_FAILURE', e);
    }
  },
  resolveName: async ({ commit }, payload) => {
    commit('RESOLVE_NAME_REQUEST');
    try {
      const address = await web3.resolveName(payload);
      commit('RESOLVE_NAME_SUCCESS');
      return address;
    } catch (e) {
      commit('RESOLVE_NAME_FAILURE', e);
      return Promise.reject();
    }
  },
  sendTransaction: async (
    { commit },
    [contractType, contractAddress, action, params, overrides]
  ) => {
    commit('SEND_TRANSACTION_REQUEST');
    try {
      const signer = web3.getSigner();
      const contract = new Contract(
        getAddress(contractAddress),
        abi[contractType],
        web3
      );
      const contractWithSigner = contract.connect(signer);

      // Gas estimation
      const gasLimitNumber = await contractWithSigner.estimateGas[action](
        ...params,
        overrides
      );
      const gasLimit = gasLimitNumber.toNumber();
      const safeGasLimit = Math.floor(gasLimit * (1 + GAS_LIMIT_BUFFER));
      overrides.gasLimit = safeGasLimit;

      const tx = await contractWithSigner[action](...params, overrides);
      await tx.wait();
      commit('SEND_TRANSACTION_SUCCESS');
      return tx;
    } catch (e) {
      if (isTxRejected(e)) {
        commit('SEND_TRANSACTION_REJECTED', e);
        return Promise.reject();
      }
      commit('SEND_TRANSACTION_FAILURE', e);
      return Promise.reject(e);
    }
  },
  loadAccount: async ({ dispatch }) => {
    if (!state.account) {
      return;
    }
    // @ts-ignore
    const tokens = Object.entries(config.tokens).map(token => token[1].address);
    await dispatch('getProxy');
    await Promise.all([
      dispatch('lookupAddress'),
      dispatch('getBalances', tokens),
      dispatch('getAllowances', { tokens, spender: state.dsProxyAddress }),
      dispatch('getMyPools'),
      dispatch('getMyPoolShares')
    ]);
  },
  getBalances: async ({ commit }, tokens) => {
    commit('GET_BALANCES_REQUEST');
    const address = state.account;
    const promises: any = [];
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      web3
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
  getAllowances: async ({ commit }, { tokens, spender }) => {
    commit('GET_ALLOWANCES_REQUEST');
    const address = state.account;
    const promises: any = [];
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      web3
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
        web3
      );
      const proxy = await dsProxyRegistryContract.proxies(address);
      commit('GET_PROXY_SUCCESS', proxy);
      return proxy;
    } catch (e) {
      commit('GET_PROXY_FAILURE', e);
      return Promise.reject();
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
