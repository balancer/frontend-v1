<template>
  <div>
    <UiTable class="m-4">
      <UiTableTh>
        <div class="flex-auto text-left">Tokens</div>
        <div class="column-sm text-left">Balance</div>
        <div class="column-sm">Deposits</div>
      </UiTableTh>
      <UiTableTr v-for="(token, i) in tokens" :key="token">
        <div class="flex-auto d-flex flex-items-center text-left d-flex">
          <Token :address="token" class="mr-2" size="20" />
          <div class="text-white">{{ config.tokens[token].symbol }}</div>
          <ButtonUnlock class="ml-2" :tokenAddress="token" />
        </div>
        <div class="column-sm text-left" v-text="$n(web3.balances[token])" />
        <input
          v-model="startBalances[i]"
          @input="handleAmountChange(i)"
          type="number"
          class="input column-sm text-right"
          placeholder="0.0"
          step="any"
          required
        />
      </UiTableTr>
    </UiTable>
    <div class="m-4 p-3 border rounded-1 text-white">
      <VueSwitch v-model="autoPricing" class="mr-3" /> Calculate deposits using
      Balancer price (recommended)
    </div>
  </div>
</template>

<script>
import config from '@/helpers/config';

export default {
  props: ['value', 'tokens', 'startWeights'],
  data() {
    return {
      config,
      startBalances: [],
      autoPricing: true
    };
  },
  methods: {
    handleAmountChange(tokenIndex) {
      if (!this.autoPricing) {
        this.$emit('input', this.startBalances);
        return;
      }

      const changedPrice = this.getPrice(
        this.tokens[tokenIndex],
        this.startBalances[tokenIndex]
      );
      const changedWeight = this.startWeights[tokenIndex];
      const totalWeight = this.startWeights.reduce(
        (a, b) => a + parseFloat(b),
        0
      );
      const totalPrice = (changedPrice / changedWeight) * totalWeight;
      this.tokens.forEach((token, i) => {
        const price = this.getPrice(token, 1);
        if (price && i !== tokenIndex)
          this.startBalances[i] = parseFloat(
            (
              ((totalPrice / totalWeight) * this.startWeights[i]) /
              price
            ).toFixed(4)
          );
      });
      this.$emit('input', this.startBalances);
    }
  },
  created() {
    this.startBalances = this.value;
  }
};
</script>
