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
  CREATE_PROXY_REQUEST() {
    console.debug('CREATE_PROXY_REQUEST');
  },
  CREATE_PROXY_SUCCESS() {
    console.debug('CREATE_PROXY_SUCCESS');
  },
  CREATE_PROXY_FAILURE(_state, payload) {
    console.debug('CREATE_PROXY_FAILURE', payload);
  },
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
  JOINSWAP_EXTERN_AMOUNT_REQUEST() {
    console.debug('JOINSWAP_EXTERN_AMOUNT_REQUEST');
  },
  JOINSWAP_EXTERN_AMOUNT_SUCCESS() {
    console.debug('JOINSWAP_EXTERN_AMOUNT_SUCCESS');
  },
  JOINSWAP_EXTERN_AMOUNT_FAILURE(_state, payload) {
    console.debug('JOINSWAP_EXTERN_AMOUNT_FAILURE', payload);
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
  EXITSWAP_POOL_AMOUNT_IN_REQUEST() {
    console.debug('EXITSWAP_POOL_AMOUNT_IN_REQUEST');
  },
  EXITSWAP_POOL_AMOUNT_IN_SUCCESS() {
    console.debug('EXITSWAP_POOL_AMOUNT_IN_SUCCESS');
  },
  EXITSWAP_POOL_AMOUNT_IN_FAILURE(_state, payload) {
    console.debug('EXITSWAP_POOL_AMOUNT_IN_FAILURE', payload);
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
  createProxy: async ({ commit, dispatch }) => {
    commit('CREATE_PROXY_REQUEST');
    try {
      const params = [
        'DSProxyRegistry',
        config.addresses.dsProxyRegistry,
        'build',
        []
      ];
      const tx = await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a proxy"]);
      dispatch('getProxy');
      commit('CREATE_PROXY_SUCCESS');
      return tx;
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_PROXY_FAILURE', e);
    }
  },
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
        const tokenMetadata = rootState.web3.tokenMetadata[token];
        const decimals = tokenMetadata ? tokenMetadata.decimals : null;
        return denormalizeBalance(amount, decimals)
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
      // await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully added liquidity"]);
      commit('JOIN_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('JOIN_POOL_FAILURE', e);
    }
  },
  joinswapExternAmountIn: async (
    { commit, dispatch, rootState },
    { poolAddress, tokenInAddress, tokenAmountIn, minPoolAmountOut }
  ) => {
    commit('JOINSWAP_EXTERN_AMOUNT_REQUEST');
    try {
      const dsProxyAddress = rootState.web3.dsProxyAddress;
      const iface = new Interface(abi.BActions);
      const data = iface.functions.joinswapExternAmountIn.encode([
        getAddress(poolAddress),
        tokenInAddress,
        tokenAmountIn,
        minPoolAmountOut
      ]);

      console.log(
        getAddress(poolAddress),
        dsProxyAddress,
        config.addresses.bActions,
        tokenInAddress,
        tokenAmountIn,
        minPoolAmountOut
      );

      await dispatch('sendTransaction', [
        'DSProxy',
        dsProxyAddress,
        'execute',
        [config.addresses.bActions, data]
      ]);
      // await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully added liquidity"]);
      commit('JOINSWAP_EXTERN_AMOUNT_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('JOINSWAP_EXTERN_AMOUNT_FAILURE', e);
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
      // await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXIT_POOL_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('EXIT_POOL_FAILURE', e);
    }
  },
  exitswapPoolAmountIn: async (
    { commit, dispatch },
    { poolAddress, tokenOutAddress, poolAmountIn, minTokenAmountOut }
  ) => {
    commit('EXITSWAP_POOL_AMOUNT_IN_REQUEST');
    try {
      const params = [
        'BPool',
        poolAddress,
        'exitswapPoolAmountIn',
        [
          getAddress(tokenOutAddress),
          parseEther(poolAmountIn),
          minTokenAmountOut
        ]
      ];
      await dispatch('sendTransaction', params);
      // await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXITSWAP_POOL_AMOUNT_IN_SUCCESS');
    } catch (e) {
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('EXITSWAP_POOL_AMOUNT_IN_FAILURE', e);
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
