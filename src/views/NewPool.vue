<template>
  <div class="px-0 px-md-5 py-4">
    <div class="d-flex flex-items-center px-4 px-md-0 mb-4">
      <h3 class="flex-auto" v-text="'Tokens'" />
    </div>
    <UiTable>
      <UiTableTh>
        <div v-text="'Asset'" class="flex-auto text-left" />
        <div v-text="'Unlock'" class="column-sm text-left" />
        <div v-text="'Weight'" class="column-lg" />
        <div v-text="'Amount'" class="column" />
        <div v-text="'Value'" class="column-lg" />
        <div v-text="'Remove'" class="column" />
      </UiTableTh>
      <div v-for="token in tokens" :key="token">
        <UiTableTr>
          <div class="d-flex flex-auto flex-items-center text-left">
            <Token :address="token" :symbol="getSymbol(token)" class="mr-3" />
            {{ getSymbol(token) }}
            <a class="d-block text-white p-1" @click="changeToken(token)">
              <Icon name="arrow-down" />
            </a>
          </div>
          <div class="column-sm text-left">
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
      <input class="input pool-input text-right" v-model="fee" />
    </div>
    <UiButton class="mt-4" @click="create">
      Create
    </UiButton>
    <ModalSelectToken
      :open="modalOpen"
      @close="modalOpen = false"
      @input="addToken"
      :not="input"
    />
  </div>
</template>

<script>
import config from '@/helpers/config';
import { bnum } from '@/helpers/utils';

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
      fee: '',
      tokens: [getTokenAddressBySymbol('DAI'), getTokenAddressBySymbol('USDC')],
      input: '',
      modalOpen: false
    };
  },
  methods: {
    changeToken(tokenAddress) {
      this.modalOpen = true;
    },
    addToken() {
      const anotherToken = getAnotherToken(config.tokens, this.tokens);
      this.tokens.push(anotherToken);
    },
    removeToken(tokenAddress) {
      const index = this.tokens.indexOf(tokenAddress);
      this.tokens.splice(index, 1);
    },
    create() {
      // TODO
    },
    handleAmountChange(tokenAddress) {
      const tokenPrice = this.subgraph.tokenPrices[tokenAddress.toLowerCase()];
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
        const tokenValue = tokenWeight.times(totalValue);
        const tokenAmount = tokenValue.div(tokenPrice.price);
        this.amounts[token] = tokenAmount.toString();
      }
    },
    getSymbol(tokenAddress) {
      return config.tokens[tokenAddress].symbol;
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
