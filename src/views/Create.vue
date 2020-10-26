<template>
  <Page>
    <div class="d-flex px-4 px-md-0 mb-3">
      <Toggle
        v-if="config.env !== 'production'"
        :value="type"
        :options="poolTypes"
        @select="handleSelectType"
      />
    </div>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('assets')" class="flex-auto" />
    </div>
    <UiTable class="mb-4">
      <UiTableTh>
        <div v-text="$t('asset')" class="flex-auto text-left" />
        <div v-text="$t('weight')" class="column" />
        <div v-text="'%'" class="column-sm hide-sm" />
        <div class="column">
          <a
            @click="togglePadlock"
            class="px-1 mr-1 tooltipped tooltipped-n"
            :aria-label="$t(padlock ? 'marketPrices' : 'customPrices')"
          >
            <span v-if="padlock"><Icon name="lock" size="16"/></span>
            <span v-else><Icon name="unlock" size="16"/></span>
          </a>
          {{ $t('amount') }}
        </div>
        <div v-text="$t('price')" class="column-sm hide-sm" />
        <div v-text="$t('totalValue')" class="column hide-sm" />
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
                tokenModalOpen = true;
                activeToken = i;
              "
            >
              <Icon name="arrow-down" />
            </a>
            <ButtonUnlock
              class="button-primary ml-2"
              :tokenAddress="token"
              :amount="amounts[token]"
            />
          </div>
          <div class="column">
            <input
              class="input pool-input text-right"
              :class="isWeightInputValid(token) ? 'text-white' : 'text-red'"
              v-model="weights[token]"
              @input="handleWeightChange(token)"
            />
          </div>
          <div class="column-sm hide-sm">
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
          <div class="column-sm hide-sm">
            <div v-text="_num(price.values[token], 'usd')" v-if="padlock" />
            <div v-text="'-'" v-else />
          </div>
          <div class="column hide-sm">
            <div v-text="_num(getValue(token), 'usd')" v-if="padlock" />
            <div v-text="'-'" v-else />
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
      {{ $t('addToken') }}
    </UiButton>
    <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h4 v-text="$t('swapFeePct')" class="flex-auto" />
    </div>
    <div class="mb-4">
      <input
        class="input pool-input text-right"
        :class="isSwapFeeInputValid() ? 'text-white' : 'text-red'"
        v-model="swapFee"
        placeholder="0.00"
      />
    </div>
    <div v-if="type === 'SMART_POOL'">
      <FormCrp
        :tokenSymbol="crp.poolTokenSymbol"
        :tokenName="crp.poolTokenName"
        :rights="crp.rights"
        :minimumWeightChangeBlockPeriod="crp.minimumWeightChangeBlockPeriod"
        :addTokenTimeLockInBlocks="crp.addTokenTimeLockInBlocks"
        :initialSupply="crp.initialSupply"
        @change-symbol="changeSymbol"
        @change-name="changeName"
        @toggle-right="toggleRight"
        @change-weight-period="changeWeightPeriod"
        @change-add-timelock="changeAddTimelock"
        @change-initial-supply="changeInitialSupply"
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
      :loading="loading"
      :disabled="validationError || hasLockedToken || !checkboxAccept"
      class="button-primary mt-4"
      @click="confirmModalOpen = true"
    >
      {{ $t('create') }}
    </UiButton>
    <ModalSelectToken
      :open="tokenModalOpen"
      @close="tokenModalOpen = false"
      @input="changeToken"
      :not="tokens"
    />
    <ModalPoolCreation
      :open="confirmModalOpen"
      :padlock="padlock"
      :tokens="tokens"
      :amounts="amounts"
      :weights="weights"
      @close="confirmModalOpen = false"
      @create="create"
    />
  </Page>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import {
  bnum,
  normalizeBalance,
  denormalizeBalance,
  getTokenBySymbol,
  isLocked,
  poolTypes
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
      poolTypes,
      type: 'SHARED_POOL',
      amounts: {},
      weights: {},
      swapFee: '',
      tokens: [],
      loading: false,
      crp: {
        poolTokenSymbol: '',
        poolTokenName: '',
        rights: {},
        minimumWeightChangeBlockPeriod: '10',
        addTokenTimeLockInBlocks: '10',
        initialSupply: '100'
      },
      activeToken: 0,
      tokenModalOpen: false,
      confirmModalOpen: false,
      padlock: true,
      checkboxAccept: false
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
        return this.$t('errMinPoolTokens');
      }
      if (this.tokens.length > 8) {
        return this.$t('errMaxPoolTokens');
      }
      // Weight validation
      for (const token of this.tokens) {
        const weight = parseFloat(this.weights[token]);
        if (weight < 2 || weight > 98) {
          return this.$t('errInvalidWeight');
        }
      }
      const totalWeight = this.tokens.reduce((acc, token) => {
        const weight = parseFloat(this.weights[token]);
        return acc + weight;
      }, 0);
      if (totalWeight > 100) {
        return this.$t('errInvalidMaxWeight');
      }
      // Amount validation
      for (const token of this.tokens) {
        const amount = bnum(this.amounts[token]);
        const weiAmount = denormalizeBalance(
          amount,
          this.web3.tokenMetadata[token].decimals
        );
        if (weiAmount.lt('1e6')) {
          return this.$t('errMinTokenBalance');
        }
        const balance = normalizeBalance(
          this.web3.balances[token],
          this.web3.tokenMetadata[token].decimals
        );
        if (amount.gt(balance)) {
          return this.$t('errExceedsBalance');
        }
      }
      // Fee validation
      const fee = parseFloat(this.swapFee);
      if (fee < 0.0001 || fee > 10) {
        return this.$t('errFeeRange');
      }
      // Smart pool validation
      if (this.type == 'SMART_POOL') {
        if (!this.crp.poolTokenSymbol) {
          return this.$t('errEmptyTokenSymbol');
        }
        if (!this.crp.poolTokenName) {
          return this.$t('errEmptyTokenName');
        }

        const weightPeriodError = validateNumberInput(
          this.crp.minimumWeightChangeBlockPeriod
        );
        const weightPeriodErrorText = formatError(weightPeriodError);
        if (weightPeriodErrorText) return weightPeriodErrorText;
        const addTimelockError = validateNumberInput(
          this.crp.addTokenTimeLockInBlocks
        );
        const addTimelockErrorText = formatError(addTimelockError);
        if (addTimelockErrorText) return addTimelockErrorText;
        const initialSupplyError = validateNumberInput(this.crp.initialSupply);
        const initialSupplyErrorText = formatError(initialSupplyError);
        if (initialSupplyErrorText) return initialSupplyErrorText;

        const weightPeriod = parseFloat(
          this.crp.minimumWeightChangeBlockPeriod
        );
        const addTimelock = parseFloat(this.crp.addTokenTimeLockInBlocks);
        if (weightPeriod < addTimelock) {
          return this.$t('errInconsistentTimelock');
        }
        const initialSupply = parseFloat(this.crp.initialSupply);
        if (initialSupply < 100 || initialSupply > 1e9) {
          return this.$t('errInitialSupplyRange');
        }
      }
      return undefined;
    },
    hasLockedToken() {
      for (const token of this.tokens) {
        if (
          isLocked(
            this.web3.allowances,
            token,
            this.web3.dsProxyAddress,
            this.amounts[token],
            this.web3.tokenMetadata[token].decimals
          )
        ) {
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
    ...mapActions(['createPool', 'createSmartPool']),
    handleSelectType(type) {
      this.type = type;
    },
    togglePadlock() {
      this.padlock = !this.padlock;
      for (const token of this.tokens) {
        Vue.set(this.amounts, token, '');
      }
    },
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
    changeSymbol(symbol) {
      this.crp.poolTokenSymbol = symbol;
    },
    changeName(name) {
      this.crp.poolTokenName = name;
    },
    toggleRight(right) {
      Vue.set(this.crp.rights, right, !this.crp.rights[right]);
    },
    changeWeightPeriod(weightPeriod) {
      this.crp.minimumWeightChangeBlockPeriod = weightPeriod;
    },
    changeAddTimelock(addTimelock) {
      this.crp.addTokenTimeLockInBlocks = addTimelock;
    },
    changeInitialSupply(initialSupply) {
      this.crp.initialSupply = initialSupply;
    },
    async create() {
      this.loading = true;
      if (this.type === 'SHARED_POOL') {
        const poolParams = {
          tokens: this.tokens,
          balances: this.amounts,
          weights: this.weights,
          swapFee: this.swapFee
        };
        await this.createPool(poolParams);
      }
      if (this.type === 'SMART_POOL') {
        const {
          poolTokenSymbol,
          poolTokenName,
          rights,
          minimumWeightChangeBlockPeriod,
          addTokenTimeLockInBlocks,
          initialSupply
        } = this.crp;
        const poolParams = {
          poolTokenSymbol,
          poolTokenName,
          constituentTokens: this.tokens,
          tokenBalances: this.amounts,
          tokenWeights: this.weights,
          swapFee: this.swapFee
        };
        const crpParams = {
          minimumWeightChangeBlockPeriod,
          addTokenTimeLockInBlocks,
          initialSupply
        };
        await this.createSmartPool({
          poolParams,
          crpParams,
          rights
        });
        this.$router.push({ name: 'my-pools' });
      }
      this.loading = false;
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
        if (token === tokenAddress || !this.padlock) {
          continue;
        }
        const tokenWeight = bnum(this.weights[token] || '');
        if (totalValue.isNaN() || tokenWeight.isNaN()) {
          Vue.set(this.amounts, token, '');
          continue;
        }
        const tokenPrice = this.price.values[token];
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
      const tokenPrice = this.price.values[tokenAddress];
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
