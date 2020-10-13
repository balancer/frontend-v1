<template>
  <div>
    <UiTable class="m-4">
      <UiTableTh>
        <div v-text="$t('tokens')" class="flex-auto text-left" />
        <div v-text="$t('balance')" class="column text-left" />
        <div v-text="$t('deposits')" class="column-sm" />
      </UiTableTh>
      <UiTableTr v-for="(token, i) in tokens" :key="token">
        <div class="flex-auto d-flex flex-items-center text-left d-flex">
          <Token :address="token" class="mr-2" size="20" />
          <div class="text-white">{{ _ticker(token) }}</div>
          <ButtonUnlock class="ml-2" :tokenAddress="token" />
        </div>
        <div class="column text-left">
          {{ _num(web3.balances[token]) }}
          {{ _ticker(token) }}
          <a class="ml-1">
            <UiLabel v-text="'Max'" />
          </a>
        </div>
        <input
          v-model="startBalances[i]"
          @input="handleAmountChange(i)"
          type="number"
          class="input column-sm text-right"
          placeholder="0.0"
          step="any"
          :class="
            web3.balances[token] >= parseFloat(startBalances[i])
              ? 'text-white'
              : 'text-red'
          "
          required
        />
      </UiTableTr>
    </UiTable>
    <div class="m-4 p-3 border rounded-1 text-white">
      <VueSwitch v-model="autoPricing" class="mr-3" />
      {{ $t('calculateDeposits') }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'tokens', 'startWeights'],
  data() {
    return {
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
