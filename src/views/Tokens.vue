<template>
  <div class="px-0 px-md-5 py-4">
    <h3 class="mb-4 px-4 px-md-0">Tokens</h3>
    <UiTable>
      <UiTableHeader>
        <div v-text="'Asset'" class="flex-auto text-left"/>
        <div v-text="'Liquidity'" class="column"/>
        <div v-text="'Price'" class="column"/>
      </UiTableHeader>
      <UiTableLine :to="{ name: 'token', params: { id: i } }" v-for="(tokenPrice, i) in subgraph.tokenPrices" :key="i">
        <Token :address="i" class="mr-3"/>
        <div class="flex-auto text-white text-left">
          {{ tokenPrice.symbol }}
        </div>
        <div class="text-right column">
          <Price :amount="tokenPrice.poolLiquidity" :precision="3" class="text-white"/>
          <div>{{ $n(tokenPrice.poolLiquidity) }} ETH</div>
        </div>
        <div class="text-right column">
          <Price :amount="tokenPrice.price" :precision="3" class="text-white"/>
          <div>{{ $n(tokenPrice.price) }} ETH</div>
        </div>
      </UiTableLine>
    </UiTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tokenPrices: {}
    };
  }
};
</script>
