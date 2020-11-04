import Vue from 'vue';
import { getInstance } from '@snapshot-labs/lock/plugins/vue';
import { lsGet, lsRemove, lsSet } from '@/helpers/localStorage';
import { sendTransaction } from '@/helpers/web3';
import provider from '@/helpers/provider';

const state = {
  transactions: lsGet('transactions') || {}
};

const mutations = {
  watchTransaction(_state, tx) {
    Vue.set(_state.transactions, tx.hash, {
      addedAt: Math.round(new Date().getTime() / 1000),
      title: tx.title,
      hash: tx.hash,
      chainId: tx.chainId,
      from: tx.from
    });
    lsSet('transactions', state.transactions);
  },
  confirmTransaction(_state, receipt) {
    Vue.set(_state.transactions, receipt.transactionHash, {
      ...state.transactions[receipt.transactionHash],
      confirmedAt: Math.round(new Date().getTime() / 1000),
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      to: receipt.to
    });
    lsSet('transactions', state.transactions);
  },
  clearTransactions(_state) {
    Vue.set(_state, 'transactions', {});
    lsRemove('transactions');
  }
};

const getters = {
  myTransactions: (state, getters, rootState) => {
    return Object.values(state.transactions)
      .filter(
        (tx: any) =>
          tx.chainId === rootState.web3.injectedChainId &&
          tx.from === rootState.web3.account
      )
      .sort((a: any, b: any) => b.addedAt - a.addedAt);
  },
  myPendingTransactions: (state, getters) => {
    const expiresIn = 60 * 60 * 24;
    const now = Math.round(new Date().getTime() / 1000);
    return getters.myTransactions.filter(
      tx => !tx.confirmedAt && tx.addedAt > now - expiresIn
    );
  }
};

const actions = {
  async processTransaction({ commit }, { params, title }) {
    console.log('Send transaction', title, params);
    const tx = await sendTransaction(getInstance().web3, params);

    console.log('Watch transaction', tx);
    commit('watchTransaction', { ...tx, title });

    const receipt = await provider.waitForTransaction(tx.hash, 1);
    console.log('Confirm transaction', receipt);
    commit('confirmTransaction', receipt);

    return tx;
  },
  async checkPendingTransactions({ commit, getters }) {
    getters.myPendingTransactions.forEach(tx => {
      provider.waitForTransaction(tx.hash, 1).then(receipt => {
        console.log('Confirm transaction', receipt);
        commit('confirmTransaction', receipt);
      });
    });
    return;
  },
  async clearTransactions({ commit }) {
    commit('clearTransactions');
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
