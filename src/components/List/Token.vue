<template>
  <div class="border-bottom d-flex text-right">
    <Token
      :address="token.address"
      size="44"
      :symbol="token.symbol"
      class="mr-2 py-3"
    />
    <div class="flex-auto text-left text-gray py-4">
      {{ token.name }} ({{ token.symbol }})
      <a :href="`https://etherscan.io/token/${token.address}`" target="_blank">
        <Icon name="external-link" class="ml-1" size="18" />
      </a>
    </div>
    <div class="text-gray column py-4">
      {{ $n(token.weightPercent.toFixed(2)) }}%
    </div>
    <div class="text-gray column py-4">
      {{ $n(parseFloat(token.balance).toFixed()) }} {{ token.symbol }}
    </div>
    <div class="text-gray column py-4">
      {{ $n(parseFloat(myPoolBalance.toFixed())) }} {{ token.symbol }}
    </div>
  </div>
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
