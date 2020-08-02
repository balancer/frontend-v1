<template>
  <div>
    <div v-text="'ETH → WETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-3">
      <div class="input d-flex flex-justify-end">
        <input
          v-model="weth.wrapAmount"
          class="flex-auto text-right text-white amount-input"
          placeholder="0.0"
        />
      </div>
      <UiButton class="ml-2 px-4" @click="wrapEther">
        Wrap
      </UiButton>
    </div>
    <div v-text="'WETH → ETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-2">
      <div class="input d-flex flex-items-center">
        <a @click="handleMax()">
          <UiLabel v-text="'Max'" />
        </a>
        <input
          v-model="weth.unwrapAmount"
          class="flex-auto text-right text-white amount-input ml-1"
          placeholder="0.0"
        />
      </div>
      <UiButton class="ml-2 px-3" @click="unwrapEther">
        Unwrap
      </UiButton>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { normalizeBalance } from '@/helpers/utils';

export default {
  data() {
    return {
      weth: {
        wrapAmount: '',
        unwrapAmount: ''
      }
    };
  },
  methods: {
    ...mapActions(['wrap', 'unwrap']),
    wrapEther() {
      this.wrap(this.weth.wrapAmount);
    },
    unwrapEther() {
      this.unwrap(this.weth.unwrapAmount);
    },
    handleMax() {
      const weth = this.config.tokens[this.config.addresses.weth];
      const wethBalance = this.web3.balances[weth.address];
      const balance = normalizeBalance(wethBalance, weth.decimals);
      this.weth.unwrapAmount = balance.toString();
    }
  }
};
</script>

<style lang="scss">
.amount-input {
  width: 60%;
  background-color: transparent;
  border: none;
}
</style>
