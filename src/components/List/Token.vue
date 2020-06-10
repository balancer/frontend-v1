<template>
  <div class="border-bottom d-flex text-center">
    <Token :address="token.address" :symbol="token.symbol" class="mr-2 py-3" />
    <div class="flex-auto text-left py-4">
      {{ token.name }} ({{ token.symbol }})
    </div>
    <div class="column py-4">{{ $n(weight) }}%</div>
    <div class="column py-4">{{ $n(token.balance) }} {{ token.symbol }}</div>
    <div class="column py-4">{{ $n(myPoolBalance) }} {{ token.symbol }}</div>
    <div class="column py-4">
      $0
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['pool', 'token'],
  computed: {
    ...mapState(['settings']),
    weight() {
      return (100 / this.pool.totalWeight) * this.token.denormWeight;
    },
    myShares() {
      if (!this.settings.address) return 0;
      const [myShares] = this.pool.shares.filter(
        share => share.userAddress.id === this.settings.address.toLowerCase()
      );
      return myShares;
    },
    myPoolBalance() {
      if (!this.myShares) return 0;
      return (
        (this.myShares.balance / this.pool.totalShares) * this.token.balance
      );
    }
  }
};
</script>
