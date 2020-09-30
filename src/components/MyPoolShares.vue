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
      const bptAddress = this.bPool.getBptAddress();
      const balance = this.web3.balances[getAddress(bptAddress)];
      return normalizeBalance(balance || '0', 18);
    },
    totalShares() {
      const poolAddress = this.bPool.getBptAddress();
      const poolSupply = this.web3.supplies[poolAddress] || 0;
      const totalShareNumber = normalizeBalance(poolSupply, 18);
      return totalShareNumber.toString();
    },
    poolSharesPercentFrom() {
      if (!this.poolTokenBalance) return 0;
      return ((100 / this.totalShares) * this.poolTokenBalance) / 100;
    },
    poolSharesPercentTo() {
      const poolTokens =
        parseFloat(this.poolTokens).toFixed(POOL_TOKENS_DECIMALS) / 1e18;
      if (!poolTokens) return this.poolSharesPercentFrom;
      const poolSharesFrom = this.poolTokenBalance;
      const poolSharesTo = poolSharesFrom + poolTokens;
      if (poolSharesTo <= 0) return 0;
      return (
        ((100 / (parseFloat(this.totalShares) + poolTokens)) * poolSharesTo) /
        100
      );
    }
  }
};
</script>
