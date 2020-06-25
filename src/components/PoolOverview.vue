<template>
  <div class="p-3 border rounded-1 text-center">
    <div class="text-left mb-4">
      <h4 class="eyebrow mb-2">Pool overview</h4>
      <div class="text-white">
        <p class="link-text mb-2">{{ pool.id | shorten }}</p>
        <p>My pool shares: {{ $n(poolShares, 'percent') }}</p>
        <p>Pool swap fee: {{ $n(pool.swapFee, 'percent') }}</p>
      </div>
    </div>
    <Pie :tokens="pool.tokens" size="100" class="mb-3" />
    <div class="text-left text-white">
      <div v-for="token in pool.tokens" :key="token.address" class="mx-4 mb-1">
        <Icon
          name="bullet"
          size="6"
          class="mr-1"
          :style="`color: ${token.chartColor}`"
        />
        {{ $n(token.weightPercent.toFixed()) }}%
        {{ token.symbol }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool'],
  computed: {
    poolShares() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!poolShares) return 0;
      return ((100 / this.pool.totalShares) * poolShares) / 100;
    }
  }
};
</script>
