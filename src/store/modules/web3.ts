import Vue from 'vue';
import { getInstance } from '@bonustrack/lock/plugins/vue';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';
import { AddressZero } from '@ethersproject/constants';
import { getAddress } from '@ethersproject/address';
import { Interface } from '@ethersproject/abi';
import abi from '@/helpers/abi';
import config from '@/config';
// @ts-ignore
import provider from '@/helpers/rpc';
import { GAS_LIMIT_BUFFER, isTxRejected, logRevertedTx } from '@/helpers/utils';

let auth;
let web3 = provider;

const state = {
  injectedLoaded: false,
  injectedChainId: null,
  blockNumber: 0,
  account: null,
  dsProxyAddress: null,
  active: false,
  balances: {},
  allowances: {},
  crps: {},
  tokenMetadata: {}
};

const mutations = {
  LOGOUT(_state) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'injectedChainId', null);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'dsProxyAddress', null);
    Vue.set(_state, 'active', false);
    Vue.set(_state, 'balances', {});
    Vue.set(_state, 'allowances', {});
    Vue.set(_state, 'crps', {});
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
  HANDLE_DISCONNECT() {
    console.debug('HANDLE_DISCONNECT');
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
    const proxyAddress = payload === AddressZero ? '' : payload;
    Vue.set(_state, 'dsProxyAddress', proxyAddress);
    console.debug('GET_PROXY_SUCCESS');
  },
  GET_PROXY_FAILURE(_state, payload) {
    console.debug('GET_PROXY_FAILURE', payload);
  },
  GET_CRPS_REQUEST() {
    console.debug('GET_CRPS_REQUEST');
  },
  GET_CRPS_SUCCESS(_state, payload) {
    for (const address in payload) {
      const crp = payload[address];
      Vue.set(_state.crps, address, crp);
    }
    console.debug('GET_CRPS_SUCCESS');
  },
  GET_CRPS_FAILURE(_state, payload) {
    console.debug('GET_CRPS_FAILURE', payload);
  }
};

const actions = {
  login: async ({ dispatch }, connector = 'injected') => {
    auth = getInstance();
    await auth.login(connector);
    if (auth.provider) {
      web3 = new Web3Provider(auth.provider);
      await dispatch('loadWeb3');
    }
  },
  logout: async ({ commit }) => {
    Vue.prototype.$auth.logout();
    commit('LOGOUT');
    commit('CLEAR_USER');
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
      // @ts-ignore
      calls.push([token, testToken.encodeFunctionData('name', [])]);
    });
    const tokenMetadata: any = {};
    try {
      const [, response] = await multi.aggregate(calls);
      for (let i = 0; i < tokens.length; i++) {
        const [decimals] = testToken.decodeFunctionResult(
          'decimals',
          response[3 * i]
        );
        const [symbol] = testToken.decodeFunctionResult(
          'symbol',
          response[3 * i + 1]
        );
        const [name] = testToken.decodeFunctionResult(
          'name',
          response[3 * i + 2]
        );
        tokenMetadata[tokens[i]] = {
          decimals,
          symbol,
          name
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
      if (!web3 || !auth.provider) {
        await dispatch('loadBackupProvider');
      } else {
        await dispatch('loadProvider');
        if (!state.injectedLoaded || state.injectedChainId !== config.chainId) {
          await dispatch('loadBackupProvider');
        }
      }
      if (state.injectedChainId === config.chainId)
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
      if (auth.provider.removeAllListeners) auth.provider.removeAllListeners();
      if (auth.provider && auth.provider.on) {
        auth.provider.on('chainChanged', async () => {
          commit('HANDLE_CHAIN_CHANGED');
          if (state.active) {
            await dispatch('logout');
            await dispatch('login');
          }
        });
        auth.provider.on('accountsChanged', async accounts => {
          if (accounts.length === 0) {
            if (state.active) await dispatch('loadWeb3');
          } else {
            commit('HANDLE_ACCOUNTS_CHANGED', accounts[0]);
            await dispatch('loadAccount');
          }
        });
        auth.provider.on('disconnect', async () => {
          commit('HANDLE_DISCONNECT');
          if (state.active) await dispatch('loadWeb3');
        });
      }
      const network = await web3.getNetwork();
      const accounts = await web3.listAccounts();
      const account = accounts.length > 0 ? accounts[0] : null;
      commit('LOAD_PROVIDER_SUCCESS', {
        injectedLoaded: true,
        injectedChainId: network.chainId,
        account
      });
    } catch (e) {
      commit('LOAD_PROVIDER_FAILURE', e);
      return Promise.reject();
    }
  },
  loadBackupProvider: async ({ commit }) => {
    commit('LOAD_BACKUP_PROVIDER_REQUEST');
    try {
      const network = await provider.getNetwork();
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
  getLatestBlock: async ({ commit }) => {
    commit('GET_LATEST_BLOCK_REQUEST');
    try {
      const block = await web3.getBlockNumber();
      commit('GET_LATEST_BLOCK_SUCCESS', block);
      return block;
    } catch (e) {
      commit('GET_LATEST_BLOCK_FAILURE', e);
      return Promise.reject();
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
    const signer = web3.getSigner();
    const contract = new Contract(
      getAddress(contractAddress),
      abi[contractType],
      web3
    );
    const contractWithSigner = contract.connect(signer);
    try {
      // Gas estimation
      const gasLimitNumber = await contractWithSigner.estimateGas[action](
        ...params,
        overrides
      );
      const gasLimit = gasLimitNumber.toNumber();
      overrides.gasLimit = Math.floor(gasLimit * (1 + GAS_LIMIT_BUFFER));

      const tx = await contractWithSigner[action](...params, overrides);
      await tx.wait();
      commit('SEND_TRANSACTION_SUCCESS');
      return tx;
    } catch (e) {
      if (isTxRejected(e)) {
        commit('SEND_TRANSACTION_REJECTED', e);
        return Promise.reject();
      }
      logRevertedTx(provider, contract, action, params);
      commit('SEND_TRANSACTION_FAILURE', e);
      return Promise.reject(e);
    }
  },
  loadAccount: async ({ dispatch }) => {
    if (!state.account) return;
    // @ts-ignore
    const tokens = Object.entries(config.tokens).map(token => token[1].address);
    await dispatch('getProxy');
    await Promise.all([
      dispatch('getBalances', tokens),
      dispatch('getAllowances', { tokens, spender: state.dsProxyAddress }),
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
    if (!spender) {
      return;
    }
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
  },
  getCrps: async ({ commit }, crps) => {
    commit('GET_CRPS_REQUEST');
    const multi = new Contract(
      config.addresses.multicall,
      abi['Multicall'],
      web3
    );
    const calls = [];
    const crpIface = new Interface(abi.ConfigurableRightsPool);
    crps.forEach(crp => {
      // @ts-ignore
      calls.push([crp, crpIface.encodeFunctionData('decimals', [])]);
      // @ts-ignore
      calls.push([crp, crpIface.encodeFunctionData('symbol', [])]);
      // @ts-ignore
      calls.push([crp, crpIface.encodeFunctionData('name', [])]);
      // @ts-ignore
      calls.push([crp, crpIface.encodeFunctionData('totalSupply', [])]);
      // @ts-ignore
      calls.push([crp, crpIface.encodeFunctionData('bspCap', [])]);
      calls.push([
        // @ts-ignore
        crp,
        // @ts-ignore
        crpIface.encodeFunctionData('addTokenTimeLockInBlocks', [])
      ]);
      calls.push([
        // @ts-ignore
        crp,
        // @ts-ignore
        crpIface.encodeFunctionData('minimumWeightChangeBlockPeriod', [])
      ]);
    });
    const crpData: any = {};
    try {
      const [, response] = await multi.aggregate(calls);
      for (let i = 0; i < crps.length; i++) {
        const [decimals] = crpIface.decodeFunctionResult(
          'decimals',
          response[7 * i]
        );
        const [symbol] = crpIface.decodeFunctionResult(
          'symbol',
          response[7 * i + 1]
        );
        const [name] = crpIface.decodeFunctionResult(
          'name',
          response[7 * i + 2]
        );
        const [totalSupplyNumber] = crpIface.decodeFunctionResult(
          'totalSupply',
          response[7 * i + 3]
        );
        const totalSupply = totalSupplyNumber.toString();
        const [bspCapNumber] = crpIface.decodeFunctionResult(
          'bspCap',
          response[7 * i + 4]
        );
        const bspCap = bspCapNumber.toString();
        const [addTokenTimeLockInBlocksNumber] = crpIface.decodeFunctionResult(
          'addTokenTimeLockInBlocks',
          response[7 * i + 5]
        );
        const addTokenTimeLockInBlocks = addTokenTimeLockInBlocksNumber.toNumber();
        const [
          minimumWeightChangeBlockPeriodNumber
        ] = crpIface.decodeFunctionResult(
          'minimumWeightChangeBlockPeriod',
          response[7 * i + 6]
        );
        const minimumWeightChangeBlockPeriod = minimumWeightChangeBlockPeriodNumber.toNumber();
        crpData[crps[i]] = {
          decimals,
          symbol,
          name,
          totalSupply,
          bspCap,
          addTokenTimeLockInBlocks,
          minimumWeightChangeBlockPeriod
        };
      }
      commit('GET_CRPS_SUCCESS', crpData);
      return crpData;
    } catch (e) {
      commit('GET_CRPS_FAILURE', e);
      return Promise.reject();
    }
  }
};

export default {
  state,
  mutations,
  actions
};
