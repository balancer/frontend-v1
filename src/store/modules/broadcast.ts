import { getAddress, Interface, parseEther } from 'ethers/utils';
import abi from '@/helpers/abi';
import config from '@/helpers/config';
import {
  bnum,
  denormalizeBalance,
  MAX_UINT,
  shorten,
  toWei
} from '@/helpers/utils';
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
  },
  APPROVE_REQUEST() {
    console.debug('APPROVE_REQUEST');
  },
  APPROVE_SUCCESS() {
    console.debug('APPROVE_SUCCESS');
  },
  APPROVE_FAILURE(_state, payload) {
    console.debug('APPROVE_FAILURE', payload);
  }
};

const actions = {
  createPool: async (
    { commit, dispatch, rootState },
    { tokens, startBalances, startWeights, swapFee }
  ) => {
    commit('CREATE_POOL_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      startBalances = tokens.map((token, i) => {
        const amountInput = startBalances[i];
        const amount = bnum(amountInput);
        return denormalizeBalance(amount, token)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString();
      });
      startWeights = tokens.map((token, i) => {
        return toWei(startWeights[i])
          .div(2)
          .toString();
      });
      swapFee = toWei(swapFee)
        .div(100)
        .toString();
      const iface = new Interface(abi.BActions);
      const data = iface.functions.create.encode([
        config.addresses.bFactory,
        tokens,
        startBalances,
        startWeights,
        swapFee,
        true
      ]);
      const params = [
        'DSProxy',
        dsProxyAddress,
        'execute',
        [config.addresses.bActions, data]
      ];
      await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a pool"]);
      commit('CREATE_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_POOL_FAILURE', e);
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

      console.log(
        getAddress(poolAddress),
        dsProxyAddress,
        config.addresses.bActions,
        poolAmountOut,
        maxAmountsIn
      );

      await dispatch('sendTransaction', [
        'DSProxy',
        dsProxyAddress,
        'execute',
        [config.addresses.bActions, data]
      ]);
      await dispatch('getBalances');
      await dispatch('getMyPoolShares');
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
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXIT_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('EXIT_POOL_FAILURE', e);
    }
  },
  approve: async ({ commit, dispatch, rootState }, token) => {
    commit('APPROVE_REQUEST');
    const spender = rootState.web3.dsProxyAddress;
    const tokenPrice = rootState.subgraph.tokenPrices[token];
    const symbol = tokenPrice ? tokenPrice.symbol : shorten(token);
    try {
      const params = [
        'TestToken',
        getAddress(token),
        'approve',
        [spender, MAX_UINT.toString()]
      ];
      const tx = await dispatch('sendTransaction', params);
      await tx.wait(1);
      await dispatch('getProxyAllowance', token);
      dispatch('notify', ['green', `You've successfully unlocked ${symbol}`]);
      commit('APPROVE_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('APPROVE_FAILURE', e);
    }
  }
};

export default {
  mutations,
  actions
};
