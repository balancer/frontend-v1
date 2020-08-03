<template>
  <div class="overflow-hidden ml-n2 mr-n2 text-center">
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2" v-text="$n(poolLiquidity, 'currency')" />
        <h4>Liquidity</h4>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2" v-text="$n(pool.lastSwapVolume, 'currency')" />
        <h4>Volume (24hr)</h4>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2" v-text="$n(pool.swapFee, 'percent')" />
        <h4>Pool Swap Fee</h4>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2" v-text="$n(poolSharePercent, 'percent')" />
        <h4>My Pool Share</h4>
      </div>
    </div>
  </div>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';

export default {
  props: ['pool'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    poolSharePercent() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!this.pool.finalized || !poolShares) return 0;
      return (1 / this.pool.totalShares) * poolShares;
    }
  }
};
</script>
