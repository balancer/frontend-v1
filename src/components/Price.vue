<template>
  <span>${{ $n(price) }}</span>
</template>

<script>
import config from '@/helpers/config';
import { getAddress } from 'ethers/utils';

export default {
  props: ['tokenAddress', 'amount', 'precision'],
  data() {
    return {
      forceRecomputeCounter: 0
    };
  },
  watch: {
    amount() {
      this.forceRecomputeCounter++;
    }
  },
  computed: {
    price() {
      this.forceRecomputeCounter;
      const amount = this.amount || 0;
      const precision = this.precision || 0;
      const tokenAddress = this.tokenAddress || config.addresses.weth;
      const checksum = getAddress(tokenAddress);
      const exchangeRate = this.market.exchangeRates[checksum];
      if (!exchangeRate) return 0;
      return (exchangeRate * amount).toFixed(precision);
    }
  }
};
</script>
