<template>
  <UiTableLine>
    <div class="flex-auto text-left">
      <router-link
        :to="{ name: 'token', params: { id: token.address } }"
        class="text-white d-flex"
      >
        <Token
          :address="token.address"
          size="20"
          :symbol="token.symbol"
          class="mr-3"
        />
        {{ token.symbol }}
      </router-link>
    </div>
    <div class="column">{{ $n(token.weightPercent.toFixed(2)) }}%</div>
    <div class="column hide-sm">
      {{ $n(parseFloat(token.balance).toFixed(2)) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md">
      {{ $n(parseFloat(myPoolBalance.toFixed(2))) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md hide-lg">
      <Price :token="token.address" :amount="myPoolBalance" />
    </div>
  </UiTableLine>
</template>

<script>
export default {
  props: ['pool', 'token'],
  computed: {
    myShares() {
      if (!this.web3.account) return 0;
      const [myShares] = this.pool.shares.filter(
        share => share.userAddress.id === this.web3.account.toLowerCase()
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
