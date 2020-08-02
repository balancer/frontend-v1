<template>
  <UiTableTr :to="{ name: 'pool', params: { id: pool.id } }">
    <div class="column-sm text-left hide-sm hide-md hide-lg">
      {{ _shorten(pool.id) }}
    </div>
    <div>
      <Pie :tokens="pool.tokens" class="mr-3" size="34" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap overflow-hidden" style="max-width: 320px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-flex flex-items-center mr-2"
          style="font-size: 16px;"
        >
          <Icon
            name="bullet"
            size="4"
            class="mr-1 pb-1"
            :style="`color: ${token.chartColor}`"
          />
          {{ $n(token.weightPercent.toFixed()) }}%
          {{ _ticker(token.checksum) }}
        </div>
      </div>
    </div>
    <div class="column hide-sm hide-md">{{ $n(pool.swapFee, 'percent') }}</div>
    <div class="column">{{ $n(pool.liquidity, 'currency') }}</div>
    <div class="column hide-sm hide-md">{{ $n(myLiquidity, 'currency') }}</div>
    <div class="column hide-sm hide-md hide-lg">
      {{ $n(pool.lastSwapVolume, 'currency') }}
    </div>
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
