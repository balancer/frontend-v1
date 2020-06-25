import Vue from 'vue';
import config from '@/helpers/config';
import { getAddress } from 'ethers/utils';

const state = {
  exchangeRates: {}
};

const getters = {
  getPrice: state => (tokenAddress, amount) => {
    const checksum = getAddress(tokenAddress);
    const exchangeRate = state.exchangeRates[checksum];
    if (!exchangeRate) return 0;
    return exchangeRate * amount;
  }
};

const mutations = {
  GET_RATES_REQUEST() {
    console.log('GET_RATES_REQUEST');
  },
  GET_RATES_SUCCESS(_state, payload) {
    Vue.set(_state, 'exchangeRates', payload);
    console.log('GET_RATES_SUCCESS');
  },
  GET_RATES_FAILURE(_state, payload) {
    console.log('GET_RATES_FAILURE', payload);
  }
};

const actions = {
  getExchangeRatesFromCoinGecko: async ({ commit }) => {
    commit('GET_RATES_REQUEST');
    try {
      const addressesStr = Object.values(config.tokens)
        .map((token: any) => token.coingeckoAddress)
        .join(',');
      const uri = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addressesStr}&vs_currencies=usd`;
      let exchangeRates = await fetch(uri).then(res => res.json());
      exchangeRates = Object.fromEntries(
        Object.entries(exchangeRates).map(exchangeRate => {
          const address = getAddress(exchangeRate[0]);
          // @ts-ignore
          return [address, exchangeRate[1].usd];
        })
      );
      exchangeRates = Object.fromEntries(
        Object.values(config.tokens).map((token: any) => {
          return [
            token.address,
            exchangeRates[getAddress(token.coingeckoAddress)] || 0
          ];
        })
      );
      commit('GET_RATES_SUCCESS', exchangeRates);
      return exchangeRates;
    } catch (e) {
      commit('GET_RATES_FAILURE', e);
    }
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};
