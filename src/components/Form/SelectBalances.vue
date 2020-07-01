<template>
  <div>
    <div class="border rounded-1 m-4">
      <UiTableTh class="border-bottom">
        <div class="flex-auto text-left">Tokens</div>
        <div class="column text-left">Balance</div>
        <div class="column">Deposits</div>
      </UiTableTh>
      <div class="p-3">
        <div v-for="(token, i) in tokens" :key="token" class="mb-2">
          <div class="d-flex flex-items-center">
            <Token :address="token" size="28" class="mr-3" />
            <div class="mr-2 flex-auto text-white">
              {{ config.tokens[token].symbol }}
            </div>
            <div class="column" v-text="$n(1)" />
            <div class="column">
              <input
                v-model="startBalances[i]"
                @input="handleAmountChange(i)"
                type="number"
                class="input text-right"
                placeholder="0.0"
                step="any"
                required
              />
            </div>
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
