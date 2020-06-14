import provider from '@/helpers/provider';

const mutations = {
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
  sendTransaction: async (
    { commit },
    [contractType, contractAddress, action, params]
  ) => {
    commit('SEND_TRANSACTION_REQUEST');
    try {
      const signer = provider.getSigner();
      const contract = provider.getContract(contractType, contractAddress);
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner[action](...params);
      await tx.wait();
      commit('SEND_TRANSACTION_SUCCESS');
    } catch (e) {
      commit('SEND_TRANSACTION_FAILURE', e);
    }
  }
};

export default {
  mutations,
  actions
};
