<template>
  <div class="overflow-hidden ml-n2 mr-n2 text-center">
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="$n(pool.liquidity, 'currency')" />
        <p class="mb-0">Liquidity</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="$n(pool.lastSwapVolume, 'currency')" />
        <p class="mb-0">Volume (24hr)</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="$n(pool.swapFee, 'percent')" />
        <p class="mb-0">Pool Swap Fee</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="$n(poolSharePercent, 'percent')" />
        <p class="mb-0">My Pool Share</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool'],
  computed: {
    poolSharePercent() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!this.pool.finalized || !poolShares) return 0;
      return (1 / this.pool.totalShares) * poolShares;
    }
  }
};
</script>
