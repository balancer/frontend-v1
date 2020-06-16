<template>
  <div class="border-bottom d-flex text-center">
    <Token
      :address="token.address"
      size="44"
      :symbol="token.symbol"
      class="mr-2 py-3"
    />
    <div class="flex-auto text-left py-4">
      {{ token.name }} ({{ token.symbol }})
      <a :href="`https://etherscan.io/token/${token.address}`" target="_blank">
        <Icon name="external-link" class="ml-1" size="18" />
      </a>
    </div>
    <div class="column py-4">{{ $n(token.weightPercent.toFixed(2)) }}%</div>
    <div class="column py-3">
      <div>{{ $n(token.balance) }} {{ token.symbol }}</div>
      <Price :tokenAddress="token.address" :amount="token.balance" />
    </div>
    <div class="column py-3">
      <div>{{ $n(myPoolBalance) }} {{ token.symbol }}</div>
      <Price :tokenAddress="token.address" :amount="myPoolBalance" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool', 'token'],
  computed: {
    myShares() {
      if (!this.provider.account) return 0;
      const [myShares] = this.pool.shares.filter(
        share => share.userAddress.id === this.provider.account.toLowerCase()
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
