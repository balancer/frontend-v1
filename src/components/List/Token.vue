<template>
  <UiTableTr>
    <div class="flex-auto text-left">
      <router-link
        :to="{ name: 'token', params: { id: token.address } }"
        class="text-white d-flex"
      >
        <Token :address="token.address" :symbol="token.symbol" class="mr-3" />
        {{ _ticker(token.checksum) }}
      </router-link>
    </div>
    <div class="column">{{ $n(token.weightPercent.toFixed(2)) }}%</div>
    <div class="column hide-sm">
      {{ $n(tokenBalance) }}
    </div>
    <div class="column hide-sm hide-md">
      {{ $n(myPoolBalance) }}
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
      const balance =
        (this.myShares / this.pool.totalShares) * this.token.balance;
      return this._precision(balance, this.token.checksum);
    },
    myShareValue() {
      const price = this.price.values[this.token.checksum];
      return price * this.myPoolBalance;
    },
    tokenBalance() {
      return this._precision(
        parseFloat(this.token.balance),
        this.token.checksum
      );
    }
  }
};
</script>
