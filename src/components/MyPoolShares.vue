<template>
  <div class="p-3 border text-white text-center rounded-1">
    Your pool share will go from {{ _num(poolSharesPercentFrom, 'percent') }} to
    {{ _num(poolSharesPercentTo, 'percent') }}
  </div>
</template>

<script>
import { POOL_TOKENS_DECIMALS } from '@/helpers/utils';

export default {
  props: ['pool', 'poolTokens'],
  computed: {
    poolSharesPercentFrom() {
      const poolSharesFrom = this.subgraph.poolShares[this.pool.id] || 0;
      if (!poolSharesFrom) return 0;
      return ((100 / this.pool.totalShares) * poolSharesFrom) / 100;
    },
    poolSharesPercentTo() {
      const poolTokens =
        parseFloat(this.poolTokens).toFixed(POOL_TOKENS_DECIMALS) / 1e18;
      if (!poolTokens) return this.poolSharesPercentFrom;
      const poolSharesFrom = this.subgraph.poolShares[this.pool.id] || 0;
      const poolSharesTo = poolSharesFrom + poolTokens;
      if (poolSharesTo <= 0) return 0;
      return (
        ((100 / (parseFloat(this.pool.totalShares) + poolTokens)) *
          poolSharesTo) /
        100
      );
    }
  }
};
</script>
