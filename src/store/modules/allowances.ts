import { formatEther } from 'ethers/utils';
import store from '@/store';
import provider from '@/helpers/provider';
import { MAX_UINT } from '@/helpers/utils';

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
  getAllowance: async ({ commit }, { tokenAddress, spender }) => {
    // @ts-ignore
    const owner = store.state.settings.address;
    const tokenContract = provider.getContract('TestToken', tokenAddress);
    const approval = formatEther(await tokenContract.allowance(owner, spender));
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
