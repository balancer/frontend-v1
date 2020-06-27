<template>
  <UiTableLine :to="{ name: 'pool', params: { id: pool.id } }">
    <div class="column-sm text-left hide-sm hide-md hide-lg">
      {{ pool.id | shorten }}
    </div>
    <div>
      <Pie :tokens="pool.tokens" class="mr-3" size="40" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap overflow-hidden" style="max-width: 320px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-flex flex-items-center mr-2"
          style="font-size: 12px; font-weight: 500"
        >
          <Icon
            name="bullet"
            size="4"
            class="mr-1"
            :style="`color: ${token.chartColor}`"
          />
          {{ $n(token.weightPercent.toFixed()) }}%
          {{ token.symbol }}
        </div>
      </div>
    </div>
    <div class="column hide-sm hide-md">{{ $n(pool.swapFee, 'percent') }}</div>
    <div class="column">
      <Price :amount="pool.liquidity" />
    </div>
    <div class="column hide-sm hide-md">
      <Price :amount="myLiquidity" />
    </div>
    <div class="column hide-sm hide-md hide-lg">
      <Price :amount="pool.lastSwapVolume" />
    </div>
  </UiTableLine>
</template>

<script>
export default {
  props: ['pool'],
  computed: {
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id] || 0;
      return (this.pool.liquidity / this.pool.totalShares) * poolShares;
    }
  }
};
</script>
