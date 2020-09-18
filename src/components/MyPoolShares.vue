<template>
  <div class="p-3 border text-white text-center rounded-1">
    Your pool share will go from {{ _num(poolSharesPercentFrom, 'percent') }} to
    {{ _num(poolSharesPercentTo, 'percent') }}
  </div>
</template>

<script>
import { normalizeBalance, POOL_TOKENS_DECIMALS } from '@/helpers/utils';
import { getAddress } from '@ethersproject/address';

export default {
  props: ['pool', 'poolTokens'],
  computed: {
    poolTokenBalance() {
      const bptAddress = this.pool.crp ? this.pool.controller : this.pool.id;
      const balance = this.web3.balances[getAddress(bptAddress)];
      return normalizeBalance(balance || '0', 18);
    },
    poolSharesPercentFrom() {
      if (!this.poolTokenBalance) return 0;
      return ((100 / this.pool.totalShares) * this.poolTokenBalance) / 100;
    },
    poolSharesPercentTo() {
      const poolTokens =
        parseFloat(this.poolTokens).toFixed(POOL_TOKENS_DECIMALS) / 1e18;
      if (!poolTokens) return this.poolSharesPercentFrom;
      const poolSharesFrom = this.poolTokenBalance;
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
