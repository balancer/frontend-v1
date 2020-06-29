<template>
  <div>
    <div class="px-4 mb-4 overflow-hidden">
      <h2 class="mb-3">Deposit</h2>
      <p class="mb-3">Deposit initial liquidity in your pool.</p>
    </div>
    <div class="px-4 text-left">
      <div class="d-flex  mb-3">
        <label class="flex-auto">Tokens</label>
        <label class="column-sm text-right">Deposits</label>
      </div>
      <div class="mb-6">
        <div v-for="(token, i) in tokens" :key="token" class="border-top">
          <div class="d-flex my-2">
            <Token :address="token" size="40" class="mr-2 pr-1 mt-1" />
            <div class="mt-2 pt-1 text-gray mr-2">
              {{ config.tokens[token].symbol }}
            </div>
            <p class="my-2 py-1 flex-auto">
              <Price :token="token" :amount="startBalances[i]" />
            </p>
            <input
              v-model="startBalances[i]"
              @input="handleAmountChange(i)"
              type="number"
              class="h2 border-0 form-control text-right ml-3 column"
              placeholder="0.0"
              step="any"
              required
            />
          </div>
        </div>
      </div>
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
      startBalances: []
    };
  },
  methods: {
    handleAmountChange(tokenIndex) {
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
