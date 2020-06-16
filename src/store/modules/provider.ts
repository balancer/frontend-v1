import Vue from 'vue';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
// import abi from '@/helpers/abi';

const supportedChainId = 1;
const infuraId = '8b8aadcdedf14ddeaa449f33b1c24953';
const backupUrls = {
  1: `https://mainnet.infura.io/v3/${infuraId}`,
  42: `https://kovan.infura.io/v3/${infuraId}`
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId
    }
  }
};

const theme = {
  background: '#ffffff',
  main: '#586069',
  secondary: '#d0d4dc',
  border: '#DDDFE8',
  hover: '#ffffff',
};

export const web3Modal = new Web3Modal({
  providerOptions,
  theme
});

const state = {
  injectedLoaded: false,
  injectedChainId: null,
  account: null,
  backUpWeb3: null,
  library: null,
  active: false,
  activeProvider: null
};

const mutations = {
  LOAD_WEB3_REQUEST() {
    console.log('LOAD_WEB3_REQUEST');
  },
  LOAD_WEB3_SUCCESS() {
    console.log('LOAD_WEB3_SUCCESS');
  },
  LOAD_WEB3_FAILURE(_state, payload) {
    console.log('LOAD_WEB3_FAILURE', payload);
  },
  LOAD_PROVIDER_REQUEST() {
    console.log('LOAD_PROVIDER_REQUEST');
  },
  LOAD_PROVIDER_SUCCESS(_state, payload) {
    Vue.set(_state, 'injectedLoaded', payload.injectedLoaded);
    Vue.set(_state, 'injectedChainId', payload.injectedChainId);
    Vue.set(_state, 'account', payload.account);
    console.log('LOAD_PROVIDER_SUCCESS');
  },
  LOAD_PROVIDER_FAILURE(_state, payload) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'injectedChainId', null);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'library', null);
    Vue.set(_state, 'active', false);
    Vue.set(_state, 'activeProvider', null);
    console.log('LOAD_PROVIDER_FAILURE', payload);
  },

  LOAD_BACKUP_PROVIDER_REQUEST() {
    console.log('LOAD_BACKUP_PROVIDER_REQUEST');
  },
  LOAD_BACKUP_PROVIDER_SUCCESS(_state, payload) {
    console.log('LOAD_BACKUP_PROVIDER_SUCCESS', payload);
  },
  LOAD_BACKUP_PROVIDER_FAILURE(_state, payload) {
    Vue.set(_state, 'injectedLoaded', false);
    Vue.set(_state, 'backUpLoaded', false);
    Vue.set(_state, 'account', null);
    Vue.set(_state, 'activeChainId', null);
    Vue.set(_state, 'backUpWeb3', null);
    Vue.set(_state, 'library', null);
    Vue.set(_state, 'active', false);
    Vue.set(_state, 'activeProvider', null);
    console.log('LOAD_BACKUP_PROVIDER_FAILURE', payload);
  },
  HANDLE_CHAIN_CHANGED() {
    console.log('HANDLE_CHAIN_CHANGED');
  },
  HANDLE_ACCOUNTS_CHANGED(_state, payload) {
    Vue.set(_state, 'account', payload);
    console.log('HANDLE_ACCOUNTS_CHANGED', payload);
  },
  HANDLE_CLOSE_CHANGED() {
    console.log('HANDLE_CLOSE_CHANGED');
  },
  HANDLE_NETWORK_CHANGED() {
    console.log('HANDLE_NETWORK_CHANGED');
  },
  SEND_TRANSACTION_REQUEST() {
    console.log('SEND_TRANSACTION_REQUEST');
  },
  SEND_TRANSACTION_SUCCESS() {
    console.log('SEND_TRANSACTION_SUCCESS');
  },
  SEND_TRANSACTION_FAILURE(_state, payload) {
    console.log('SEND_TRANSACTION_FAILURE', payload);
  }
};

const actions = {
  loadWeb3Modal: async ({ dispatch }) => {
    const provider = await web3Modal.connect();
    if (provider) await dispatch('loadWeb3', provider);
    await dispatch('getBalances', state.account);
    await dispatch('getProxies', state.account);
  },
  loadWeb3: async ({ commit, dispatch }, provider = null) => {
    commit('LOAD_WEB3_REQUEST');
    try {
      if (provider === null && window.ethereum) {
        await dispatch('loadProvider', window.ethereum);
        commit('LOAD_WEB3_SUCCESS');
      } else if (provider) {
        await dispatch('loadProvider', provider);
        commit('LOAD_WEB3_SUCCESS');
      }
      if (!state.injectedLoaded || state.injectedChainId !== supportedChainId) {
        await dispatch('loadBackupProvider');
      } else {
        console.log(`[Provider] Injected provider active.`);
        /**
        this.providerStatus.library = this.providerStatus.injectedWeb3;
        this.providerStatus.activeChainId = this.providerStatus.injectedChainId;
        this.providerStatus.injectedActive = true;
        if (this.providerStatus.account)
          this.fetchUserBlockchainData(this.providerStatus.account);
        */
      }
    } catch (e) {
      commit('LOAD_WEB3_FAILURE', e);
    }
  },
  loadProvider: async ({ commit, dispatch }, provider) => {
    commit('LOAD_PROVIDER_REQUEST');
    try {
      // @TODO Remove any old listeners
      const web3 = new ethers.providers.Web3Provider(provider);
      if ((provider as any).isMetaMask) {
        console.log(`[Provider] MetaMask auto refresh off`);
        (provider as any).autoRefreshOnNetworkChange = false;
      }
      if (provider.on) {
        provider.on('chainChanged', async () => {
          commit('HANDLE_CHAIN_CHANGED');
          if (state.active) {
            await dispatch('loadWeb3');
            // @TODO Loads pool & balance data for account
          }
        });
        provider.on('accountsChanged', async accounts => {
          if (accounts.length === 0) {
            if (state.active) await dispatch('loadWeb3');
          } else {
            // @TODO Loads pool & balance data for account
            commit('HANDLE_ACCOUNTS_CHANGED', accounts[0]);
          }
        });
        provider.on('close', async () => {
          commit('HANDLE_CLOSE');
          if (state.active) await dispatch('loadWeb3');
        });
        provider.on('networkChanged', async () => {
          commit('HANDLE_NETWORK_CHANGED');
          if (state.active) {
            await dispatch('loadWeb3');
            // @TODO Loads pool & balance data for account
          }
        });
      }
      const network = await web3.getNetwork();
      const accounts = await web3.listAccounts();
      const account = accounts.length > 0 ? accounts[0] : null;
      commit('LOAD_PROVIDER_SUCCESS', {
        injectedLoaded: true,
        injectedChainId: network.chainId,
        account
        // injectedWeb3: web3,
        // activeProvider: provider
      });
    } catch (e) {
      commit('LOAD_PROVIDER_FAILURE', e);
    }
  },
  loadBackupProvider: async ({ commit }) => {
    try {
      const web3 = new ethers.providers.JsonRpcProvider(
        backupUrls[supportedChainId]
      );
      const network = await web3.getNetwork();
      commit('LOAD_BACKUP_PROVIDER_SUCCESS', {
        injectedActive: false,
        backUpLoaded: true,
        account: null,
        activeChainId: network.chainId
        // backUpWeb3: web3,
        // library: web3,
        // activeProvider: backupUrls[supportedChainId]
      });
    } catch (e) {
      commit('LOAD_BACKUP_PROVIDER_FAILURE', e);
    }
  },
  sendTransaction: async ({ commit }) =>
    // [contractType, contractAddress, action, params]
    {
      commit('SEND_TRANSACTION_REQUEST');
      try {
        /*
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        abi[contractType],
        provider
      );
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner[action](...params);
      await tx.wait();
      commit('SEND_TRANSACTION_SUCCESS');
      */
      } catch (e) {
        commit('SEND_TRANSACTION_FAILURE', e);
      }
    }
};

export default {
  state,
  mutations,
  actions
};
