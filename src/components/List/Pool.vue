<template>
  <div>
    <router-link
      :to="{ name: 'pool', params: { id: pool.id } }"
      class="py-3 border-bottom d-flex"
    >
      <div class="flex-auto">
        <div>
          <Pie :tokens="pool.tokens" class="mr-2" />
          <div
            v-for="token in pool.tokens"
            :key="token.address"
            class="text-center d-inline-block"
          >
            <Token
              :address="token.address"
              :symbol="token.symbol"
              class="mx-1"
            />
            <div style="font-size: 11px;" class="mt-n1">
              {{ $n(token.weightPercent.toFixed()) }}%
            </div>
          </div>
        </div>
      </div>
      <div class="text-gray text-center mt-3 column">
        {{ $n(pool.swapFeePercent) }}%
      </div>
      <div class="text-gray text-center mt-3 hide-sm hide-md column">
        <Price :amount="pool.totalEthValue" />
      </div>
      <div class="text-gray text-center mt-3 hide-sm hide-md column">
        <Price :amount="pool.totalVolume1Day" />
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ['pool']
};
</script>
