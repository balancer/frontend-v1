<template>
  <UiTableTr>
    <div class="flex-auto text-left">
      <router-link
        :to="{ name: 'token', params: { id: token.address } }"
        class="text-white d-flex"
      >
        <Token :address="token.address" :symbol="token.symbol" class="mr-3" />
        {{ token.symbol }}
      </router-link>
    </div>
    <div class="column">{{ $n(token.weightPercent.toFixed(2)) }}%</div>
    <div class="column hide-sm">
      {{ $n(parseInt(token.balance)) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md">
      {{ $n(myPoolBalance) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md hide-lg">
      {{ $n(myShareValue, 'currency') }}
    </div>
  </UiTableTr>
</template>

<script>
export default {
  props: ['pool', 'token'],
  computed: {
    myShares() {
      if (!this.web3.account) return 0;
      return this.subgraph.poolShares[this.pool.id];
    },
    myPoolBalance() {
      if (!this.myShares) return 0;
      return (this.myShares / this.pool.totalShares) * this.token.balance;
    },
    myShareValue() {
      const price = this.price.values[this.token.checksum];
      return price * this.myPoolBalance;
    }
  }
};
</script>
