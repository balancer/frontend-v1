<template>
  <UiTableTr :to="{ name: 'pool', params: { id: pool.id } }">
    <div>
      <Pie :tokens="pool.tokens" class="mr-3" size="34" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap overflow-hidden" style="max-width: 340px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="d-flex flex-items-center mr-2"
        >
          <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
          {{ _shorten(token.symbol, 12) }}
          {{ _num(token.weightPercent / 100, 'percent-short') }}
        </div>
      </div>
    </div>
    <div
      v-text="_num(pool.swapFee, 'percent')"
      class="column hide-sm hide-md"
    />
    <div v-text="_num(poolLiquidity, 'usd')" class="column" />
    <div
      v-text="_num(pool.lastSwapVolume, 'usd')"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
  </UiTableTr>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';

export default {
  props: ['pool'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    }
  }
};
</script>
