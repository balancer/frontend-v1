<template>
  <List>
    <div class="flex-auto text-left">
      <a
        :href="`https://etherscan.io/token/${token.address}`"
        class="text-white d-flex"
        target="_blank"
      >
        <Token
          :address="token.address"
          size="20"
          :symbol="token.symbol"
          class="mr-3"
        />
        {{ token.symbol }}
        <Icon name="external-link ml-2" size="16" />
      </a>
    </div>
    <div class="column">{{ $n(token.weightPercent.toFixed(2)) }}%</div>
    <div class="column hide-sm">
      {{ $n(parseFloat(token.balance).toFixed(2)) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md">
      {{ $n(parseFloat(myPoolBalance.toFixed(2))) }} {{ token.symbol }}
    </div>
    <div class="column hide-sm hide-md hide-lg">
      <Price :amount="myPoolBalance" :tokenAddress="token.address" />
    </div>
  </List>
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
