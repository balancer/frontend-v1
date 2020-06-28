<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">Tokens</h3>
    <UiTable>
      <UiTableHeader>
        <div v-text="'Asset'" class="flex-auto text-left" />
        <div v-text="'Top liquidity'" class="column" />
        <div v-text="'Price'" class="column" />
        <div v-text="'Balance'" class="column" />
      </UiTableHeader>
      <UiTableLine
        :to="{ name: 'token', params: { id: i } }"
        v-for="(tokenPrice, i) in tokenPrices"
        :key="i"
        class="text-white"
      >
        <Token :address="i" class="mr-3" />
        <div class="flex-auto text-white text-left">
          {{ tokenPrice.symbol }}
        </div>
        <div class="column">
          {{ $n(tokenPrice.poolLiquidity, 'currency') }}
        </div>
        <div class="column">
          {{ $n(tokenPrice.price, 'price') }}
        </div>
        <div class="column">
          {{ $n(tokenPrice.balance, 'currency') }}
        </div>
      </UiTableLine>
    </UiTable>
  </div>
</template>

<script>
import { getAddress } from 'ethers/utils';

export default {
  computed: {
    tokenPrices() {
      return Object.fromEntries(
        Object.entries(this.subgraph.tokenPrices)
          .map(tokenPrice => {
            const balance = this.web3.balances[getAddress(tokenPrice[0])];
            tokenPrice[1].balance = balance || 0;
            return tokenPrice;
          })
          .sort((a, b) => b[1].balance - a[1].balance)
      );
    }
  }
};
</script>
