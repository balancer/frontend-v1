<template>
  <UiTableTr :to="{ name: 'pool', params: { id: pool.id } }">
    <div class="column-sm text-left hide-sm hide-md hide-lg">
      {{ _shorten(pool.id) }}
    </div>
    <div>
      <Pie :tokens="pool.tokens" class="mr-3" size="34" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap overflow-hidden" style="max-width: 340px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-flex flex-items-center mr-2"
        >
          <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
          {{ _num(token.weightPercent.toFixed()) }}%
          {{ _ticker(token.checksum) }}
        </div>
      </div>
    </div>
    <UiNum
      :value="pool.swapFee"
      format="percent"
      class="column hide-sm hide-md"
    />
    <UiNum :value="pool.liquidity" format="currency" class="column" />
    <UiNum
      :value="myLiquidity"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
    <UiNum
      :value="pool.lastSwapVolume"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
  </UiTableTr>
</template>

<script>
export default {
  props: ['pool'],
  computed: {
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!this.pool.finalized || !poolShares) return 0;
      return (this.pool.liquidity / this.pool.totalShares) * poolShares;
    }
  }
};
</script>
