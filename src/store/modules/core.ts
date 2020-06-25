import { getAddress, Interface, parseEther } from 'ethers/utils';
import abi from '@/helpers/abi';
import config from '@/helpers/config';
import { bnum, denormalizeBalance, toWei } from '@/helpers/utils';
import BigNumber from '@/helpers/bignumber';

const mutations = {
  CREATE_POOL_REQUEST() {
    console.debug('CREATE_POOL_REQUEST');
  },
  CREATE_POOL_SUCCESS() {
    console.debug('CREATE_POOL_SUCCESS');
  },
  CREATE_POOL_FAILURE(_state, payload) {
    console.debug('CREATE_POOL_FAILURE', payload);
  },
  JOIN_POOL_REQUEST() {
    console.debug('JOIN_POOL_REQUEST');
  },
  JOIN_POOL_SUCCESS() {
    console.debug('JOIN_POOL_SUCCESS');
  },
  JOIN_POOL_FAILURE(_state, payload) {
    console.debug('JOIN_POOL_FAILURE', payload);
  },
  EXIT_POOL_REQUEST() {
    console.debug('EXIT_POOL_REQUEST');
  },
  EXIT_POOL_SUCCESS() {
    console.debug('EXIT_POOL_SUCCESS');
  },
  EXIT_POOL_FAILURE(_state, payload) {
    console.debug('EXIT_POOL_FAILURE', payload);
  }
};

const actions = {
  createPool: async (
    { commit, dispatch },
    { proxyAddress, tokens, amounts, weights, fee }
  ) => {
    commit('CREATE_POOL_REQUEST');
    try {
      const balances = tokens.map((token, i) => {
        const amountInput = amounts[i];
        const amount = bnum(amountInput);
        return denormalizeBalance(amount, token)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString();
      });
      const denorms = tokens.map((token, i) => {
        return toWei(weights[i])
          .div(2)
          .toString();
      });
      const swapFee = toWei(fee)
        .div(100)
        .toString();
      const iface = new Interface(abi.BActions);
      const data = iface.functions.create.encode([
        config.addresses.bFactory,
        tokens,
        balances,
        denorms,
        swapFee,
        true
      ]);
      const params = [
        'DSProxy',
        proxyAddress,
        'execute',
        [config.addresses.bActions, data]
      ];
      await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a pool"]);
      commit('CREATE_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_POOL_FAILURE');
    }
  },
  joinPool: async (
    { commit, dispatch, rootState },
    { poolAddress, poolAmountOut, maxAmountsIn }
  ) => {
    commit('JOIN_POOL_REQUEST');
    try {
      const dsProxyAddress = rootState.web3.dsProxyAddress;
      const iface = new Interface(abi.BActions);
      const data = iface.functions.joinPool.encode([
        getAddress(poolAddress),
        poolAmountOut,
        maxAmountsIn
      ]);
      await dispatch('sendTransaction', [
        'DSProxy',
        dsProxyAddress,
        'execute',
        [config.addresses.bActions, data]
      ]);
      await dispatch('getBalances');
      await dispatch('getPoolShares');
      dispatch('notify', ['green', "You've successfully added liquidity"]);
      commit('JOIN_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('JOIN_POOL_FAILURE', e);
    }
  },
  exitPool: async (
    { commit, dispatch },
    { poolAddress, poolAmountIn, minAmountsOut }
  ) => {
    commit('EXIT_POOL_REQUEST');
    try {
      const params = [
        'BPool',
        poolAddress,
        'exitPool',
        [parseEther(poolAmountIn), minAmountsOut]
      ];
      await dispatch('sendTransaction', params);
      await dispatch('getBalances');
      await dispatch('getPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXIT_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('EXIT_POOL_FAILURE');
    }
  }
};

export default {
  mutations,
  actions
};
