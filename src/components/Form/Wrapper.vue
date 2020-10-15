<template>
  <div>
    <div v-text="'ETH → WETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-3">
      <UiButton class="d-flex flex-auto">
        <input
          v-model="wrapAmount"
          class="width-full amount-input"
          :class="wrapInputValid ? 'text-white' : 'text-red'"
          placeholder="0.0"
        />
        <a @click="handleWrapMax()" class="mr-n2 ml-2">
          <UiLabel v-text="'Max'" />
        </a>
      </UiButton>
      <UiButton
        class="ml-2 col-4"
        @click="wrapEther"
        :loading="wrapLoading"
        :disabled="!wrapInputValid"
      >
        {{ $t('wrap') }}
      </UiButton>
    </div>
    <div v-text="'WETH → ETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-2">
      <UiButton class="d-flex flex-auto position-relative">
        <input
          v-model="unwrapAmount"
          class="width-full amount-input ml-1"
          :class="unwrapInputValid ? 'text-white' : 'text-red'"
          placeholder="0.0"
        />
        <a @click="handleUnwrapMax()" class="mr-n2 ml-2">
          <UiLabel v-text="'Max'" />
        </a>
      </UiButton>
      <UiButton
        class="ml-2 col-4"
        @click="unwrapEther"
        :loading="unwrapLoading"
        :disabled="!unwrapInputValid"
      >
        {{ $t('unwrap') }}
      </UiButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { normalizeBalance } from '@/helpers/utils';
import { validateNumberInput, ValidationError } from '@/helpers/validation';

export default {
  data() {
    return {
      wrapAmount: '',
      wrapLoading: false,
      unwrapAmount: '',
      unwrapLoading: false
    };
  },
  computed: {
    wrapInputValid() {
      const error = validateNumberInput(this.wrapAmount);
      if (error !== ValidationError.NONE && error !== ValidationError.EMPTY)
        return false;
      const ethBalance = this.web3.balances['ether'] || '0';
      const balance = normalizeBalance(ethBalance, 18);
      return !balance.lt(this.wrapAmount);
    },
    unwrapInputValid() {
      const error = validateNumberInput(this.unwrapAmount);
      if (error !== ValidationError.NONE && error !== ValidationError.EMPTY)
        return false;
      const wethBalance = this.web3.balances[this.config.addresses.weth] || '0';
      const balance = normalizeBalance(wethBalance, 18);
      return !balance.lt(this.unwrapAmount);
    }
  },
  methods: {
    ...mapActions(['wrap', 'unwrap']),
    async wrapEther() {
      this.wrapLoading = true;
      await this.wrap(this.wrapAmount);
      this.wrapLoading = false;
    },
    async unwrapEther() {
      this.unwrapLoading = true;
      await this.unwrap(this.unwrapAmount);
      this.unwrapLoading = false;
    },
    handleWrapMax() {
      const ethBalance = this.web3.balances['ether'] || '0';
      const balance = normalizeBalance(ethBalance, 18);
      this.wrapAmount = balance.toString();
    },
    handleUnwrapMax() {
      const weth = this.config.tokens[this.config.addresses.weth];
      const wethBalance = this.web3.balances[weth.address];
      const balance = normalizeBalance(wethBalance, weth.decimals);
      this.unwrapAmount = balance.toString();
    }
  }
};
</script>

<style lang="scss">
.amount-input {
  background-color: transparent;
  border: none;
}
</style>
