<template>
  <div class="p-3 border text-white text-center rounded-1">
    Your pool share will go from {{ $n(poolShares, 'percent') }} to X%
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
