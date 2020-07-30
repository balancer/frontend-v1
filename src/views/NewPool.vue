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
            <Token :address="token" :symbol="token" class="mr-3" />
            {{ _ticker(token) }}
            <a
              class="d-block text-white p-1"
              @click="
                modalOpen = true;
                activeToken = i;
              "
            >
              <Icon name="arrow-down" />
            </a>
            <ButtonUnlock class="button-primary ml-2" :tokenAddress="token" />
          </div>
          <div class="column-lg d-flex flex-items-center flex-justify-between">
            <input
              class="input pool-input text-right"
              :class="isWeightInputValid(token) ? 'text-white' : 'text-red'"
              v-model="weights[token]"
              @input="handleWeightChange(token)"
            />
            {{ $n(getRelativeWeight(token), 'percent') }}
          </div>
          <div class="column">
            <input
              class="input pool-input text-right"
              :class="isAmountInputValid(token) ? 'text-white' : 'text-red'"
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
    <UiButton class="mt-4" @click="addToken">
      Add Token
    </UiButton>
    <div class="d-flex flex-items-center px-4 px-md-0 my-4">
      <h3 class="flex-auto" v-text="'Swap fee (%)'" />
    </div>
    <div>
      <input
        class="input pool-input text-right"
        :class="isSwapFeeInputValid() ? 'text-white' : 'text-red'"
        v-model="swapFee"
        placeholder="0.00"
      />
    </div>
    <MessageError v-if="validationError" :text="validationError" class="mt-4" />
    <MessageCustomToken
      v-if="hasCustomToken"
      :accepted="customTokenAccept"
      @toggle="customTokenAccept = !customTokenAccept"
      class="mt-4"
    />
    <UiButton
      :disabled="
        validationError ||
          hasLockedToken ||
          (hasCustomToken && !customTokenAccept)
      "
      class="button-primary mt-4"
      @click="create"
    >
      Create
    </UiButton>
    <ModalSelectToken
      :open="modalOpen"
      @close="modalOpen = false"
      @input="changeToken"
      :not="tokens"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import config from '@/helpers/config';
import { bnum, normalizeBalance, denormalizeBalance } from '@/helpers/utils';

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
    if (token.symbol === 'ETH') {
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
      swapFee: '',
      tokens: [],
      activeToken: 0,
      modalOpen: false,
      customTokenAccept: false
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
    validationError() {
      // Basic input validation
      for (const token of this.tokens) {
        if (!this.amounts[token] || !this.weights[token]) {
          return `Values can't be empty`;
        }
      }
      if (!this.swapFee) {
        return `Values can't be empty`;
      }
      for (const token of this.tokens) {
        if (isNaN(this.amounts[token]) || isNaN(this.weights[token])) {
          return 'Values should be numbers';
        }
      }
      if (isNaN(this.swapFee)) {
        return 'Values should be numbers';
      }
      for (const token of this.tokens) {
        if (parseFloat(this.amounts[token]) <= 0) {
          return 'Values should be positive numbers';
        }
        if (parseFloat(this.weights[token]) <= 0) {
          return 'Values should be positive numbers';
        }
      }
      if (parseFloat(this.swapFee) <= 0) {
        return 'Values should be positive numbers';
      }
      // Weight validation
      for (const token of this.tokens) {
        const weight = parseFloat(this.weights[token]);
        if (weight < 2 || weight > 98) {
          return 'Weight should be from 2 to 98';
        }
      }
      const totalWeight = this.tokens.reduce((acc, token) => {
        const weight = parseFloat(this.weights[token]);
        return acc + weight;
      }, 0);
      if (totalWeight > 100) {
        return 'Total weight should not exceed 100';
      }
      // Amount validation
      for (const token of this.tokens) {
        const amount = bnum(this.amounts[token]);
        const weiAmount = denormalizeBalance(
          amount,
          this.web3.tokenMetadata[token].decimals
        );
        if (weiAmount.lt('1e6')) {
          return 'Token balance in wei form needs to be at least 1,000,000. For example, WBTC has 8 decimals so the minimum is 0.01 WBTC.';
        }
        const balance = normalizeBalance(
          this.web3.balances[token],
          this.web3.tokenMetadata[token].decimals
        );
        if (amount.gt(balance)) {
          return 'Token amount should not exceed balance';
        }
      }
      // Fee validation
      const fee = parseFloat(this.swapFee);
      if (fee < 0.0001 || fee > 10) {
        return 'Fee should be from 0.0001% to 10%';
      }
      return undefined;
    },
    hasLockedToken() {
      const proxyAddress = this.web3.dsProxyAddress;
      for (const token of this.tokens) {
        const tokenAllowance = this.web3.allowances[token];
        if (!tokenAllowance || !tokenAllowance[proxyAddress]) {
          return true;
        }
        const allowance = tokenAllowance[proxyAddress];
        if (allowance === '0') {
          return true;
        }
      }
      return false;
    },
    hasCustomToken() {
      if (this.validationError) {
        return false;
      }
      for (const token of this.tokens) {
        const tokenMetadata = this.web3.tokenMetadata[token];
        if (!tokenMetadata || !tokenMetadata.whitelisted) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    ...mapActions(['createPool']),
    changeToken(selectedToken) {
      const tokenAddress = getAddress(selectedToken);
      Vue.set(this.tokens, this.activeToken, tokenAddress);
      Vue.set(this.weights, tokenAddress, '');
      Vue.set(this.amounts, tokenAddress, '');
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
    handleWeightChange(tokenAddress) {
      this.handleAmountChange(tokenAddress);
    },
    handleAmountChange(tokenAddress) {
      const tokenPrice = this.price.values[tokenAddress];
      if (!tokenPrice) {
        return;
      }
      const tokenValue = bnum(this.amounts[tokenAddress]).times(tokenPrice);
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
        const tokenPrice = this.price.values[token];
        if (!tokenPrice) {
          continue;
        }
        const tokenValue = tokenWeight.times(totalValue);
        const tokenAmount = tokenValue.div(tokenPrice);
        this.amounts[token] = tokenAmount.toString();
      }
    },
    isWeightInputValid(tokenAddress) {
      if (!this.weights[tokenAddress] || isNaN(this.weights[tokenAddress])) {
        return false;
      }
      const weight = bnum(this.weights[tokenAddress]);
      if (weight.lt(2) || weight.gt(98)) {
        return false;
      }
      return true;
    },
    isAmountInputValid(tokenAddress) {
      if (!this.amounts[tokenAddress] || isNaN(this.amounts[tokenAddress])) {
        return false;
      }
      const amount = bnum(this.amounts[tokenAddress]);
      if (amount.lte(0)) {
        return false;
      }
      const weiAmount = denormalizeBalance(
        amount,
        this.web3.tokenMetadata[tokenAddress].decimals
      );
      if (weiAmount.lt('1e6')) {
        return false;
      }
      const balance = normalizeBalance(
        this.web3.balances[tokenAddress],
        this.web3.tokenMetadata[tokenAddress].decimals
      );
      if (amount.gt(balance)) {
        return false;
      }
      return true;
    },
    isSwapFeeInputValid() {
      if (!this.swapFee || isNaN(this.swapFee)) {
        return false;
      }
      const swapFee = parseFloat(this.swapFee);
      if (swapFee <= 0) {
        return false;
      }
      if (swapFee < 0.0001 || swapFee > 10) {
        return false;
      }
      return true;
    },
    getValue(tokenAddress) {
      const tokenPrice = this.price.values[tokenAddress];
      if (!tokenPrice || !this.amounts[tokenAddress]) {
        return '-';
      }
      return bnum(this.amounts[tokenAddress])
        .times(tokenPrice)
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
