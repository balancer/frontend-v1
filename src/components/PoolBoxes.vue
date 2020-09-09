<template>
  <div class="overflow-hidden ml-n2 mr-n2 text-center">
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(pool.liquidity, 'currency')" />
        <p class="mb-0">Liquidity</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(pool.lastSwapVolume, 'currency')" />
        <p class="mb-0">Volume (24hr)</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(pool.swapFee, 'percent')" />
        <p class="mb-0">Swap fee</p>
      </div>
    </div>
    <div class="col-12 col-md-3 float-left mb-4">
      <div
        class="border rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h3 v-text="_num(poolSharePercent, 'percent')" />
        <p class="mb-0">My pool share</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAddress } from '@ethersproject/address';
import { getPoolLiquidity } from '@/helpers/price';
import { normalizeBalance } from '@/helpers/utils';

export default {
  props: ['pool'],
  computed: {
    poolTokenBalance() {
      let balance = this.subgraph.poolShares[this.pool.id] || 0;
      const nodeBalance = this.web3.balances[getAddress(this.pool.id)];
      if (nodeBalance) balance = normalizeBalance(nodeBalance, 18);
      return balance;
    },
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    poolSharePercent() {
      const poolShares = this.poolTokenBalance;
      if (!this.pool.finalized || !poolShares) return 0;
      return (1 / this.pool.totalShares) * poolShares;
    }
  }
};
</script>
