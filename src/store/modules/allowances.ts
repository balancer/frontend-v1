import { ethers } from 'ethers';
import { formatEther } from 'ethers/utils';
import { MAX_UINT } from '@/helpers/utils';
import abi from '@/helpers/abi';
import web3 from '@/helpers/web3';

const state = {
  approvals: {}
};

const mutations = {
  SET_APPROVAL(_state, { tokenAddress, approval, spender }) {
    const spenderApprovals = state.approvals[spender] || {};
    spenderApprovals[tokenAddress] = approval;
    state.approvals[spender] = spenderApprovals;
    console.log('SET_APPROVAL');
  },
  APPROVE_REQUEST() {
    console.log('APPROVE_REQUEST');
  },
  APPROVE_SUCCESS() {
    console.log('APPROVE_SUCCESS');
  },
  APPROVE_FAILURE() {
    console.log('APPROVE_FAILURE');
  }
};

const actions = {
  getAllowance: async ({ commit, rootState }, { tokenAddress, spender }) => {
    const owner = rootState.web3.account;
    const tokenContract = new ethers.Contract(
      tokenAddress,
      abi['TestToken'],
      web3
    );
    const approval = formatEther(await tokenContract.allowance(owner, spender));
    console.log('Approval', approval);
    commit('SET_APPROVAL', { tokenAddress, spender, approval });
  },
  approve: async ({ commit, dispatch }, { tokenAddress, spender }) => {
    commit('APPROVE_REQUEST');
    try {
      const params = [
        'TestToken',
        tokenAddress,
        'approve',
        [spender, MAX_UINT.toString()]
      ];
      await dispatch('sendTransaction', params);
      commit('APPROVE_SUCCESS');
    } catch (e) {
      commit('APPROVE_FAILURE');
    }
  }
};

export default {
  state,
  mutations,
  actions
};
