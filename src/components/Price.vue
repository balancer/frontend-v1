<template>
  <span>{{ $n(price, 'price') }}</span>
</template>

<script>
import config from '@/helpers/config';

export default {
  props: ['token', 'amount'],
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
      const token = this.token || config.addresses.weth;
      return this.getPrice(token, amount);
    }
  }
};
</script>
