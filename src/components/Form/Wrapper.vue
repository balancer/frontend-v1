<template>
  <div>
    <div v-text="'ETH → WETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-3">
      <div class="input d-flex flex-justify-end">
        <input
          v-model="wrapAmount"
          class="flex-auto text-right text-white amount-input"
          placeholder="0.0"
        />
      </div>
      <UiButton class="ml-2 px-4" @click="wrapEther" :loading="wrapLoading">
        Wrap
      </UiButton>
    </div>
    <div v-text="'WETH → ETH'" class="eyebrow mb-2" />
    <div class="d-flex mb-2">
      <div class="input d-flex flex-items-center position-relative">
        <a
          @click="handleMax()"
          class="panel-background position-absolute left-0 top-0"
          style="margin: 5px 10px;"
        >
          <UiLabel v-text="'Max'" />
        </a>
        <input
          v-model="unwrapAmount"
          class="flex-auto text-right text-white amount-input ml-1"
          placeholder="0.0"
        />
      </div>
      <UiButton class="ml-2 px-3" @click="unwrapEther" :loading="unwrapLoading">
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
      wrapAmount: '',
      wrapLoading: false,
      unwrapAmount: '',
      unwrapLoading: false
    };
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
  width: 60%;
  background-color: transparent;
  border: none;
}
</style>
