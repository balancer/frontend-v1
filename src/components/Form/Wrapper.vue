<template>
  <div>
    <div v-text="'ETH → WETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-3">
      <div class="input d-flex flex-justify-end">
        <input
          v-model="wrapAmount"
          class="flex-auto text-right amount-input"
          :class="wrapInputValid ? 'text-white' : 'text-red'"
          placeholder="0.0"
        />
      </div>
      <UiButton
        class="ml-2 px-4"
        @click="wrapEther"
        :loading="wrapLoading"
        :disabled="!wrapInputValid"
      >
        Wrap
      </UiButton>
    </div>
    <div v-text="'WETH → ETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-2">
      <div
        class="input d-flex flex-items-center flex-justify-between position-relative"
      >
        <a @click="handleMax()">
          <UiLabel v-text="'Max'" />
        </a>
        <input
          v-model="unwrapAmount"
          class="flex-auto text-right amount-input ml-1"
          :class="unwrapInputValid ? 'text-white' : 'text-red'"
          placeholder="0.0"
        />
      </div>
      <UiButton
        class="ml-2 px-3"
        @click="unwrapEther"
        :loading="unwrapLoading"
        :disabled="!unwrapInputValid"
      >
        Unwrap
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
      if (error !== ValidationError.NONE && error !== ValidationError.EMPTY) {
        return false;
      }
      const ethBalance = this.web3.balances['ether'] || '0';
      const balance = normalizeBalance(ethBalance, 18);
      if (balance.lt(this.wrapAmount)) {
        return false;
      }
      return true;
    },
    unwrapInputValid() {
      const error = validateNumberInput(this.unwrapAmount);
      if (error !== ValidationError.NONE && error !== ValidationError.EMPTY) {
        return false;
      }
      const wethBalance = this.web3.balances[this.config.addresses.weth] || '0';
      const balance = normalizeBalance(wethBalance, 18);
      if (balance.lt(this.unwrapAmount)) {
        return false;
      }
      return true;
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
    handleMax() {
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
  width: 50%;
  background-color: transparent;
  border: none;
}
</style>
