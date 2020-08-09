<template>
  <div class="px-0 px-md-5 py-4">
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="'Create a pool'" />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 class="flex-auto" v-text="'Assets'" />
    </div>
    <UiTable class="mb-4">
      <UiTableTh>
        <div v-text="'Asset'" class="flex-auto text-left" />
        <div v-text="'Weight'" class="column" />
        <div v-text="'%'" class="column" />
        <div v-text="'Amount'" class="column" />
        <div v-text="'Value'" class="column" />
        <div class="column-xs" />
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
          <div class="column">
            <input
              class="input pool-input text-right"
              :class="isWeightInputValid(token) ? 'text-white' : 'text-red'"
              v-model="weights[token]"
              @input="handleWeightChange(token)"
            />
          </div>
          <div class="column">
            <div v-text="_num(getRelativeWeight(token), 'percent')" />
          </div>
          <div class="column">
            <input
              class="input pool-input text-right"
              :class="isAmountInputValid(token) ? 'text-white' : 'text-red'"
              v-model="amounts[token]"
              @input="handleAmountChange(token)"
            />
          </div>
          <div class="column">
            <div v-text="_num(getValue(token), 'currency')" />
          </div>
          <div class="column-xs">
            <a
              v-if="tokens.length > 1"
              class="d-flex flex-justify-end text-white"
              @click="removeToken(token)"
            >
              <Icon name="close" />
            </a>
          </div>
        </UiTableTr>
      </div>
    </UiTable>
    <UiButton v-if="tokens.length < 8" class="mb-4" @click="addToken">
      Add Token
    </UiButton>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 class="flex-auto" v-text="'Swap fee (%)'" />
    </div>
    <div class="mb-4">
      <input
        class="input pool-input text-right"
        :class="isSwapFeeInputValid() ? 'text-white' : 'text-red'"
        v-model="swapFee"
        placeholder="0.00"
      />
    </div>
    <MessageError v-if="validationError" :text="validationError" class="mt-4" />
    <MessageSimilarPools v-if="pool" :pool="pool" class="mt-4" />
    <MessageCheckbox
      v-if="!validationError"
      :custom="hasCustomToken"
      :accepted="checkboxAccept"
      @toggle="checkboxAccept = !checkboxAccept"
      class="mt-4"
    />
    <UiButton
      :disabled="validationError || hasLockedToken || !checkboxAccept"
      class="button-primary mt-4"
      @click="create"
      :loading="loading"
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
import {
  bnum,
  normalizeBalance,
  denormalizeBalance,
  getTokenBySymbol
} from '@/helpers/utils';
import { validateNumberInput, formatError } from '@/helpers/validation';

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
      checkboxAccept: false,
      loading: false
    };
  },
  created() {
    if (!this.web3.dsProxyAddress) {
      return this.$router.push({ name: 'setup' });
    }
    const dai = getTokenBySymbol('DAI').address;
    const usdc = getTokenBySymbol('USDC').address;
    this.tokens = [dai, usdc];
    Vue.set(this.weights, dai, '30');
    Vue.set(this.weights, usdc, '20');
    this.loading = false;
  },
  computed: {
    pool() {
      if (this.validationError) {
        return;
      }
      const tokens = this.tokens.map(token => {
        return {
          checksum: token,
          weightPercent: 100 * this.getRelativeWeight(token)
        };
      });
      const swapFee = (parseFloat(this.swapFee) / 100).toString();
      const liquidity = '0';
      return {
        tokens,
        swapFee,
        liquidity
      };
    },
    validationError() {
      for (const token of this.tokens) {
        const amountError = validateNumberInput(this.amounts[token]);
        const amountErrorText = formatError(amountError);
        if (amountErrorText) return amountErrorText;
        const weightError = validateNumberInput(this.weights[token]);
        const weightErrorText = formatError(weightError);
        if (weightErrorText) return weightErrorText;
      }
      const feeError = validateNumberInput(this.swapFee);
      const feeErrorText = formatError(feeError);
      if (feeErrorText) return feeErrorText;
      // Token count validation
      if (this.tokens.length < 2) {
        return 'Pool should contain at least 2 tokens';
      }
      if (this.tokens.length > 8) {
        return 'Pool should contain no more than 8 tokens';
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
      const anotherToken = getAnotherToken(this.config.tokens, this.tokens);
      this.tokens.push(anotherToken);
      Vue.set(this.weights, anotherToken, '');
      Vue.set(this.amounts, anotherToken, '');
    },
    removeToken(tokenAddress) {
      const index = this.tokens.indexOf(tokenAddress);
      this.tokens.splice(index, 1);
    },
    async create() {
      this.loading = true;
      await this.createPool({
        tokens: this.tokens,
        startBalances: this.amounts,
        startWeights: this.weights,
        swapFee: this.swapFee
      });
      this.loading = false;
    },
    handleWeightChange(tokenAddress) {
      this.handleAmountChange(tokenAddress);
    },
    handleAmountChange(tokenAddress) {
      const tokenPrice = this.subgraph.tokens[tokenAddress];
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
          Vue.set(this.amounts, token, '');
          continue;
        }
        const tokenPrice = this.subgraph.tokens[token];
        if (!tokenPrice) {
          continue;
        }
        const tokenValue = tokenWeight.times(totalValue);
        const tokenAmount = tokenValue.div(tokenPrice);
        Vue.set(this.amounts, token, tokenAmount.toString());
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
      const tokenPrice = this.subgraph.tokens[tokenAddress];
      if (!tokenPrice || !this.amounts[tokenAddress]) {
        return 0;
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
