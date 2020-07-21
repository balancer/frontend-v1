<template>
  <div class="px-0 px-md-5 py-4">
    <div class="d-flex flex-items-center px-4 px-md-0 mb-4">
      <h3 class="flex-auto" v-text="'Tokens'" />
    </div>
    <UiTable>
      <UiTableTh>
        <div v-text="'Asset'" class="flex-auto text-left" />
        <div v-text="'Weight (total max: 100)'" class="column-lg" />
        <div v-text="'Amount'" class="column" />
        <div v-text="'Value'" class="column-lg" />
        <div v-text="'Remove'" class="column" />
      </UiTableTh>
      <div v-for="(token, i) in tokens" :key="token">
        <UiTableTr>
          <div class="d-flex flex-auto flex-items-center text-left">
            <Token :address="token" :symbol="getSymbol(token)" class="mr-3" />
            {{ getSymbol(token) }}
            <a
              class="d-block text-white p-1"
              @click="
                modalOpen = true;
                activeToken = i;
              "
            >
              <Icon name="arrow-down" />
            </a>
            <ButtonUnlock class="ml-2" :tokenAddress="token" />
          </div>
          <div class="column-lg d-flex flex-items-center flex-justify-between">
            <input
              class="input pool-input text-right"
              v-model="weights[token]"
            />
            {{ $n(getRelativeWeight(token), 'percent') }}
          </div>
          <div class="column">
            <input
              class="input pool-input text-right"
              v-model="amounts[token]"
              @input="handleAmountChange(token)"
            />
          </div>
          <div class="column-lg">
            {{ getValue(token) }}
          </div>
          <div class="column">
            <a
              class="d-flex flex-justify-end text-white"
              @click="removeToken(token)"
            >
              <Icon name="close" />
            </a>
          </div>
        </UiTableTr>
      </div>
    </UiTable>
    <UiButton class="button-outline mt-4" @click="addToken">
      Add Token
    </UiButton>
    <div class="d-flex flex-items-center px-4 px-md-0 my-4">
      <h3 class="flex-auto" v-text="'Swap fee'" />
    </div>
    <div>
      <input class="input pool-input text-right" v-model="swapFee" />
    </div>
    <UiButton class="mt-4" @click="create">
      Create
    </UiButton>
    <ModalSelectToken
      :open="modalOpen"
      @close="modalOpen = false"
      @input="changeToken"
      :not="tokens.map(token => token.toLowerCase())"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { getAddress } from 'ethers/utils';

import config from '@/helpers/config';
import { shorten, bnum } from '@/helpers/utils';

function getTokenAddressBySymbol(symbol) {
  const tokenAddresses = Object.keys(config.tokens);
  return tokenAddresses.find(
    tokenAddress => config.tokens[tokenAddress].symbol === symbol
  );
}

function getAnotherToken(tokens, selectedTokens) {
  const tokenAddresses = Object.keys(tokens);
  for (const tokenAddress of tokenAddresses) {
    const token = tokens[tokenAddress];
    if (token.symbol == 'ETH') {
      continue;
    }
    if (!selectedTokens.includes(token.address)) {
      return token.address;
    }
  }
}

export default {
  data() {
    return {
      amounts: {},
      weights: {},
      swapFee: '0.15',
      tokens: [],
      activeToken: 0,
      modalOpen: false
    };
  },
  created() {
    const dai = getTokenAddressBySymbol('DAI');
    const usdc = getTokenAddressBySymbol('USDC');
    this.tokens = [dai, usdc];
    Vue.set(this.weights, dai, '30');
    Vue.set(this.weights, usdc, '20');
  },
  computed: {
    excludedTokens() {
      return this.tokens.map(token => token.toLowerCase());
    }
  },
  methods: {
    ...mapActions(['createPool', 'loadTokenMetadata']),
    changeToken(selectedToken) {
      const tokenAddress = getAddress(selectedToken);
      Vue.set(this.tokens, this.activeToken, tokenAddress);
      Vue.set(this.weights, tokenAddress, '');
      Vue.set(this.amounts, tokenAddress, '');
      this.loadTokenMetadata([tokenAddress]);
    },
    addToken() {
      const anotherToken = getAnotherToken(config.tokens, this.tokens);
      this.tokens.push(anotherToken);
      Vue.set(this.weights, anotherToken, '');
      Vue.set(this.amounts, anotherToken, '');
    },
    removeToken(tokenAddress) {
      const index = this.tokens.indexOf(tokenAddress);
      this.tokens.splice(index, 1);
    },
    create() {
      this.createPool({
        tokens: this.tokens,
        startBalances: this.amounts,
        startWeights: this.weights,
        swapFee: this.swapFee
      });
    },
    handleAmountChange(tokenAddress) {
      const tokenPrice = this.subgraph.tokenPrices[tokenAddress.toLowerCase()];
      if (!tokenPrice || !tokenPrice.price) {
        return;
      }
      const tokenValue = bnum(this.amounts[tokenAddress]).times(
        tokenPrice.price
      );
      const totalValue = tokenValue.div(this.weights[tokenAddress]);

      for (const token of this.tokens) {
        if (token === tokenAddress) {
          continue;
        }
        const tokenWeight = bnum(this.weights[token] || '');
        if (totalValue.isNaN() || tokenWeight.isNaN()) {
          this.amounts[token] = '';
          continue;
        }
        const tokenPrice = this.subgraph.tokenPrices[token.toLowerCase()];
        if (!tokenPrice || !tokenPrice.price) {
          continue;
        }
        const tokenValue = tokenWeight.times(totalValue);
        const tokenAmount = tokenValue.div(tokenPrice.price);
        this.amounts[token] = tokenAmount.toString();
      }
    },
    getSymbol(tokenAddress) {
      if (config.tokens[tokenAddress]) {
        return config.tokens[tokenAddress].symbol;
      }
      return shorten(tokenAddress);
    },
    getValue(tokenAddress) {
      const tokenPrice = this.subgraph.tokenPrices[tokenAddress.toLowerCase()];
      if (!tokenPrice || !this.amounts[tokenAddress]) {
        return '-';
      }
      return bnum(this.amounts[tokenAddress])
        .times(tokenPrice.price)
        .toFixed(2);
    },
    getRelativeWeight(tokenAddress) {
      const absoluteWeight = this.weights[tokenAddress];
      const totalWeight = this.tokens.reduce((acc, val) => {
        const weight = parseFloat(this.weights[val]) || 0;
        return acc + weight;
      }, 0);
      if (!absoluteWeight || !totalWeight) {
        return 0;
      }
      return absoluteWeight / totalWeight;
    }
  }
};
</script>

<style scoped>
.pool-input {
  width: 100px;
}
</style>
