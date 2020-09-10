import { Interface } from '@ethersproject/abi';
import abi from '@/helpers/abi';
import config from '@/config';
import {
  bnum,
  denormalizeBalance,
  MAX_UINT,
  toWei,
  isTxReverted,
  shortenAddress
} from '@/helpers/utils';
import BigNumber from '@/helpers/bignumber';

function makeProxyTransaction(
  dsProxy,
  [contractType, contractAddress, action, params, overrides]: any
) {
  const iface = new Interface(abi[contractType]);
  const data = iface.encodeFunctionData(action, params);
  return ['DSProxy', dsProxy, 'execute', [contractAddress, data], overrides];
}

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
  CREATE_SMART_POOL_REQUEST() {
    console.debug('CREATE_SMART_POOL_REQUEST');
  },
  CREATE_SMART_POOL_SUCCESS() {
    console.debug('CREATE_SMART_POOL_SUCCESS');
  },
  CREATE_SMART_POOL_FAILURE(_state, payload) {
    console.debug('CREATE_SMART_POOL_FAILURE', payload);
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
  SET_PUBLIC_SWAP_REQUEST() {
    console.debug('SET_PUBLIC_SWAP_REQUEST');
  },
  SET_PUBLIC_SWAP_SUCCESS() {
    console.debug('SET_PUBLIC_SWAP_SUCCESS');
  },
  SET_PUBLIC_SWAP_FAILURE(_state, payload) {
    console.debug('SET_PUBLIC_SWAP_FAILURE', payload);
  },
  SET_SWAP_FEE_REQUEST() {
    console.debug('SET_SWAP_FEE_REQUEST');
  },
  SET_SWAP_FEE_SUCCESS() {
    console.debug('SET_SWAP_FEE_SUCCESS');
  },
  SET_SWAP_FEE_FAILURE(_state, payload) {
    console.debug('SET_SWAP_FEE_FAILURE', payload);
  },
  SET_CONTROLLER_REQUEST() {
    console.debug('SET_CONTROLLER_REQUEST');
  },
  SET_CONTROLLER_SUCCESS() {
    console.debug('SET_CONTROLLER_SUCCESS');
  },
  SET_CONTROLLER_FAILURE(_state, payload) {
    console.debug('SET_CONTROLLER_FAILURE', payload);
  },
  INCREASE_WEIGHT_REQUEST() {
    console.debug('INCREASE_WEIGHT_REQUEST');
  },
  INCREASE_WEIGHT_SUCCESS() {
    console.debug('INCREASE_WEIGHT_SUCCESS');
  },
  INCREASE_WEIGHT_FAILURE(_state, payload) {
    console.debug('INCREASE_WEIGHT_FAILURE', payload);
  },
  DECREASE_WEIGHT_REQUEST() {
    console.debug('DECREASE_WEIGHT_REQUEST');
  },
  DECREASE_WEIGHT_SUCCESS() {
    console.debug('DECREASE_WEIGHT_SUCCESS');
  },
  DECREASE_WEIGHT_FAILURE(_state, payload) {
    console.debug('DECREASE_WEIGHT_FAILURE', payload);
  },
  UPDATE_WEIGHTS_GRADUALLY_REQUEST() {
    console.debug('UPDATE_WEIGHTS_GRADUALLY_REQUEST');
  },
  UPDATE_WEIGHTS_GRADUALLY_SUCCESS() {
    console.debug('UPDATE_WEIGHTS_GRADUALLY_SUCCESS');
  },
  UPDATE_WEIGHTS_GRADUALLY_FAILURE(_state, payload) {
    console.debug('UPDATE_WEIGHTS_GRADUALLY_FAILURE', payload);
  },
  SET_CAP_REQUEST() {
    console.debug('SET_CAP_REQUEST');
  },
  SET_CAP_SUCCESS() {
    console.debug('SET_CAP_SUCCESS');
  },
  SET_CAP_FAILURE(_state, payload) {
    console.debug('SET_CAP_FAILURE', payload);
  },
  COMMIT_ADD_TOKEN_REQUEST() {
    console.debug('COMMIT_ADD_TOKEN_REQUEST');
  },
  COMMIT_ADD_TOKEN_SUCCESS() {
    console.debug('COMMIT_ADD_TOKEN_SUCCESS');
  },
  COMMIT_ADD_TOKEN_FAILURE(_state, payload) {
    console.debug('COMMIT_ADD_TOKEN_FAILURE', payload);
  },
  APPLY_ADD_TOKEN_REQUEST() {
    console.debug('APPLY_ADD_TOKEN_REQUEST');
  },
  APPLY_ADD_TOKEN_SUCCESS() {
    console.debug('APPLY_ADD_TOKEN_SUCCESS');
  },
  APPLY_ADD_TOKEN_FAILURE(_state, payload) {
    console.debug('APPLY_ADD_TOKEN_FAILURE', payload);
  },
  REMOVE_TOKEN_REQUEST() {
    console.debug('REMOVE_TOKEN_REQUEST');
  },
  REMOVE_TOKEN_SUCCESS() {
    console.debug('REMOVE_TOKEN_SUCCESS');
  },
  REMOVE_TOKEN_FAILURE(_state, payload) {
    console.debug('REMOVE_TOKEN_FAILURE', payload);
  },
  WHITELIST_LP_REQUEST() {
    console.debug('WHITELIST_LP_REQUEST');
  },
  WHITELIST_LP_SUCCESS() {
    console.debug('WHITELIST_LP_SUCCESS');
  },
  WHITELIST_LP_FAILURE(_state, payload) {
    console.debug('WHITELIST_LP_FAILURE', payload);
  },
  REMOVE_WHITELISTED_LP_REQUEST() {
    console.debug('REMOVE_WHITELISTED_LP_REQUEST');
  },
  REMOVE_WHITELISTED_LP_SUCCESS() {
    console.debug('REMOVE_WHITELISTED_LP_SUCCESS');
  },
  REMOVE_WHITELISTED_LP_FAILURE(_state, payload) {
    console.debug('REMOVE_WHITELISTED_LP_FAILURE', payload);
  },
  APPROVE_REQUEST() {
    console.debug('APPROVE_REQUEST');
  },
  APPROVE_SUCCESS() {
    console.debug('APPROVE_SUCCESS');
  },
  APPROVE_FAILURE(_state, payload) {
    console.debug('APPROVE_FAILURE', payload);
  },
  WRAP_ETH_REQUEST() {
    console.debug('WRAP_ETH_REQUEST');
  },
  WRAP_ETH_SUCCESS() {
    console.debug('WRAP_ETH_SUCCESS');
  },
  WRAP_ETH_FAILURE(_state, payload) {
    console.debug('WRAP_ETH_FAILURE', payload);
  },
  UNWRAP_ETH_REQUEST() {
    console.debug('UNWRAP_ETH_REQUEST');
  },
  UNWRAP_ETH_SUCCESS() {
    console.debug('UNWRAP_ETH_SUCCESS');
  },
  UNWRAP_ETH_FAILURE(_state, payload) {
    console.debug('UNWRAP_ETH_FAILURE', payload);
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
        [],
        {}
      ];
      const tx = await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a proxy"]);
      dispatch('getProxy');
      commit('CREATE_PROXY_SUCCESS');
      return tx;
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_PROXY_FAILURE', e);
    }
  },
  createPool: async (
    { commit, dispatch, rootState },
    { tokens, balances, weights, swapFee }
  ) => {
    commit('CREATE_POOL_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      balances = tokens.map(token => {
        const amountInput = balances[token];
        const amount = bnum(amountInput);
        const tokenMetadata = rootState.web3.tokenMetadata[token];
        const decimals = tokenMetadata ? tokenMetadata.decimals : null;
        return denormalizeBalance(amount, decimals)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString();
      });
      weights = tokens.map(token => {
        return toWei(weights[token])
          .div(2)
          .toString();
      });
      swapFee = toWei(swapFee)
        .div(100)
        .toString();
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'create',
        [config.addresses.bFactory, tokens, balances, weights, swapFee, true],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a pool"]);
      commit('CREATE_POOL_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_POOL_FAILURE', e);
    }
  },
  createSmartPool: async (
    { commit, dispatch, rootState },
    { poolParams, crpParams, rights }
  ) => {
    commit('CREATE_SMART_POOL_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    const { poolTokenSymbol, poolTokenName, constituentTokens } = poolParams;
    let { tokenBalances, tokenWeights, swapFee } = poolParams;
    let { initialSupply } = crpParams;
    const {
      minimumWeightChangeBlockPeriod,
      addTokenTimeLockInBlocks
    } = crpParams;
    try {
      tokenBalances = constituentTokens.map(token => {
        const amountInput = tokenBalances[token];
        const amount = bnum(amountInput);
        const tokenMetadata = rootState.web3.tokenMetadata[token];
        const decimals = tokenMetadata ? tokenMetadata.decimals : null;
        return denormalizeBalance(amount, decimals)
          .integerValue(BigNumber.ROUND_DOWN)
          .toString();
      });
      tokenWeights = constituentTokens.map(token => {
        return toWei(tokenWeights[token])
          .div(2)
          .toString();
      });
      swapFee = toWei(swapFee)
        .div(100)
        .toString();
      poolParams = {
        poolTokenSymbol,
        poolTokenName,
        constituentTokens,
        tokenBalances,
        tokenWeights,
        swapFee
      };
      initialSupply = toWei(initialSupply).toString();
      crpParams = {
        initialSupply,
        minimumWeightChangeBlockPeriod,
        addTokenTimeLockInBlocks
      };

      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'createSmartPool',
        [
          config.addresses.crpFactory,
          config.addresses.bFactory,
          poolParams,
          crpParams,
          rights
        ],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      dispatch('notify', ['green', "You've successfully created a pool"]);
      commit('CREATE_SMART_POOL_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('CREATE_SMART_POOL_FAILURE', e);
    }
  },
  joinPool: async (
    { commit, dispatch, rootState },
    { poolAddress, poolAmountOut, maxAmountsIn }
  ) => {
    commit('JOIN_POOL_REQUEST');
    try {
      const dsProxyAddress = rootState.web3.dsProxyAddress;
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'joinPool',
        [poolAddress, poolAmountOut, maxAmountsIn],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully added liquidity"]);
      commit('JOIN_POOL_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
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
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'joinswapExternAmountIn',
        [poolAddress, tokenInAddress, tokenAmountIn, minPoolAmountOut],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully added liquidity"]);
      commit('JOINSWAP_EXTERN_AMOUNT_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
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
        [toWei(poolAmountIn).toString(), minAmountsOut],
        {}
      ];
      await dispatch('sendTransaction', params);
      await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXIT_POOL_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
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
        [tokenOutAddress, toWei(poolAmountIn).toString(), minTokenAmountOut],
        {}
      ];
      await dispatch('sendTransaction', params);
      await dispatch('getBalances');
      await dispatch('getMyPoolShares');
      dispatch('notify', ['green', "You've successfully removed liquidity"]);
      commit('EXITSWAP_POOL_AMOUNT_IN_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('EXITSWAP_POOL_AMOUNT_IN_FAILURE', e);
    }
  },
  setPublicSwap: async (
    { commit, dispatch, rootState },
    { poolAddress, publicSwap }
  ) => {
    commit('SET_PUBLIC_SWAP_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'setPublicSwap',
        [poolAddress, publicSwap],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('SET_PUBLIC_SWAP_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('SET_PUBLIC_SWAP_FAILURE', e);
    }
  },
  setSwapFee: async (
    { commit, dispatch, rootState },
    { poolAddress, newFee }
  ) => {
    commit('SET_SWAP_FEE_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      newFee = toWei(newFee)
        .div(100)
        .toString();
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'setSwapFee',
        [poolAddress, newFee],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('SET_SWAP_FEE_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('SET_SWAP_FEE_FAILURE', e);
    }
  },
  setController: async (
    { commit, dispatch, rootState },
    { poolAddress, newController }
  ) => {
    commit('SET_CONTROLLER_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'setController',
        [poolAddress, newController],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('SET_CONTROLLER_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('SET_CONTROLLER_FAILURE', e);
    }
  },
  increaseWeight: async (
    { commit, dispatch, rootState },
    { poolAddress, token, newWeight, tokenAmountIn }
  ) => {
    commit('INCREASE_WEIGHT_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      newWeight = toWei(newWeight)
        .div(2)
        .toString();
      const tokenMetadata = rootState.web3.tokenMetadata[token];
      const decimals = tokenMetadata ? tokenMetadata.decimals : null;
      tokenAmountIn = denormalizeBalance(tokenAmountIn, decimals)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString();
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'increaseWeight',
        [poolAddress, token, newWeight, tokenAmountIn],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('INCREASE_WEIGHT_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('INCREASE_WEIGHT_FAILURE', e);
    }
  },
  decreaseWeight: async (
    { commit, dispatch, rootState },
    { poolAddress, token, newWeight, poolAmountIn }
  ) => {
    commit('DECREASE_WEIGHT_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      newWeight = toWei(newWeight)
        .div(2)
        .toString();
      poolAmountIn = toWei(poolAmountIn);
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'decreaseWeight',
        [poolAddress, token, newWeight, poolAmountIn.toString()],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('DECREASE_WEIGHT_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('DECREASE_WEIGHT_FAILURE', e);
    }
  },
  updateWeightsGradually: async (
    { commit, dispatch, rootState },
    { poolAddress, newWeights, startBlock, endBlock }
  ) => {
    commit('UPDATE_WEIGHTS_GRADUALLY_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      newWeights = Object.keys(newWeights).map(token => {
        return toWei(newWeights[token])
          .div(2)
          .toString();
      });
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'updateWeightsGradually',
        [poolAddress, newWeights, startBlock, endBlock],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('UPDATE_WEIGHTS_GRADUALLY_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('UPDATE_WEIGHTS_GRADUALLY_FAILURE', e);
    }
  },
  setCap: async ({ commit, dispatch, rootState }, { poolAddress, newCap }) => {
    commit('SET_CAP_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      newCap = toWei(newCap).toString();
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'setCap',
        [poolAddress, newCap],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('SET_CAP_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('SET_CAP_FAILURE', e);
    }
  },
  commitAddToken: async (
    { commit, dispatch, rootState },
    { poolAddress, token, balance, denormalizedWeight }
  ) => {
    commit('COMMIT_ADD_TOKEN_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const tokenMetadata = rootState.web3.tokenMetadata[token];
      const decimals = tokenMetadata ? tokenMetadata.decimals : null;
      balance = denormalizeBalance(balance, decimals)
        .integerValue(BigNumber.ROUND_DOWN)
        .toString();
      denormalizedWeight = toWei(denormalizedWeight)
        .div(2)
        .toString();
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'commitAddToken',
        [poolAddress, token, balance, denormalizedWeight],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('COMMIT_ADD_TOKEN_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('COMMIT_ADD_TOKEN_FAILURE', e);
    }
  },
  applyAddToken: async (
    { commit, dispatch, rootState },
    { poolAddress, token, tokenAmountIn }
  ) => {
    commit('APPLY_ADD_TOKEN_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'applyAddToken',
        [poolAddress, token, tokenAmountIn],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('APPLY_ADD_TOKEN_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('APPLY_ADD_TOKEN_FAILURE', e);
    }
  },
  removeToken: async (
    { commit, dispatch, rootState },
    { poolAddress, token, poolAmountIn }
  ) => {
    commit('REMOVE_TOKEN_REQUEST');
    poolAmountIn = toWei(poolAmountIn);
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'removeToken',
        [poolAddress, token, poolAmountIn.toString()],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('REMOVE_TOKEN_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('REMOVE_TOKEN_FAILURE', e);
    }
  },
  whitelistLiquidityProvider: async (
    { commit, dispatch, rootState },
    { poolAddress, provider }
  ) => {
    commit('WHITELIST_LP_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'whitelistLiquidityProvider',
        [poolAddress, provider],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('WHITELIST_LP_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('WHITELIST_LP_FAILURE', e);
    }
  },
  removeWhitelistedLiquidityProvider: async (
    { commit, dispatch, rootState },
    { poolAddress, provider }
  ) => {
    commit('REMOVE_WHITELISTED_LP_REQUEST');
    const dsProxyAddress = rootState.web3.dsProxyAddress;
    try {
      const underlyingParams = [
        'BActions',
        config.addresses.bActions,
        'removeWhitelistedLiquidityProvider',
        [poolAddress, provider],
        {}
      ];
      const params = makeProxyTransaction(dsProxyAddress, underlyingParams);
      await dispatch('sendTransaction', params);
      commit('REMOVE_WHITELISTED_LP_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('REMOVE_WHITELISTED_LP_FAILURE', e);
    }
  },
  approve: async ({ commit, dispatch, rootState }, token) => {
    commit('APPROVE_REQUEST');
    const spender = rootState.web3.dsProxyAddress;
    const tokenMetadata = rootState.web3.tokenMetadata[token];
    const symbol = tokenMetadata ? tokenMetadata.symbol : shortenAddress(token);
    try {
      const params = [
        'TestToken',
        token,
        'approve',
        [spender, MAX_UINT.toString()],
        {}
      ];
      const tx = await dispatch('sendTransaction', params);
      await tx.wait(2);
      await dispatch('getAllowances', { tokens: [token], spender });
      dispatch('notify', ['green', `You've successfully unlocked ${symbol}`]);
      commit('APPROVE_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('APPROVE_FAILURE', e);
    }
  },
  wrap: async ({ commit, dispatch }, amount) => {
    commit('WRAP_ETH_REQUEST');
    try {
      const params = [
        'Weth',
        config.addresses.weth,
        'deposit',
        [],
        { value: toWei(amount).toString() }
      ];
      await dispatch('sendTransaction', params);
      dispatch('notify', [
        'green',
        `You've successfully wrapped ${amount} ether`
      ]);
      commit('WRAP_ETH_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('WRAP_ETH_FAILURE', e);
    }
  },
  unwrap: async ({ commit, dispatch }, amount) => {
    commit('UNWRAP_ETH_REQUEST');
    try {
      const params = [
        'Weth',
        config.addresses.weth,
        'withdraw',
        [toWei(amount).toString()],
        {}
      ];
      await dispatch('sendTransaction', params);
      dispatch('notify', [
        'green',
        `You've successfully unwrapped ${amount} ether`
      ]);
      commit('UNWRAP_ETH_SUCCESS');
    } catch (e) {
      if (!e || isTxReverted(e)) {
        return e;
      }
      dispatch('notify', ['red', 'Ooops, something went wrong']);
      commit('UNWRAP_ETH_FAILURE', e);
    }
  }
};

export default {
  mutations,
  actions
};
