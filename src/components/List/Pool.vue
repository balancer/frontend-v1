<template>
  <UiTableTr
    :to="{ name: migratable ? 'migrate' : 'pool', params: { id: pool.id } }"
  >
    <div class="column-sm text-left hide-sm hide-md hide-lg">
      {{ _shortenAddress(pool.id) }}
    </div>
    <div>
      <Pie :tokens="pool.tokens" class="mr-3" size="34" />
    </div>
    <div class="flex-auto text-left">
      <div class="d-flex flex-wrap" style="max-width: 340px;">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          :class="token.symbol.length > 14 && 'tooltipped tooltipped-n'"
          :aria-label="token.symbol"
          class="d-flex flex-items-center mr-2"
        >
          <Icon name="bullet" size="16" :style="`color: ${token.color}`" />
          {{ _num(token.weightPercent / 100, 'percent-short') }}
          {{ _shorten(token.symbol, 14) }}
        </div>
      </div>
    </div>
    <UiNum
      :value="pool.swapFee"
      format="percent"
      class="column hide-sm hide-md"
    />
    <div v-text="_num(poolLiquidity, 'usd')" class="column" />
    <div
      v-text="_num(myLiquidity, 'usd')"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
    <div
      v-text="_num(pool.lastSwapVolume, 'usd')"
      format="currency"
      class="column hide-sm hide-md hide-lg"
    />
    <div v-if="migratable" class="column hide-sm hide-md hide-lg">
      <button
        class="button-migrate"
        :class="{ primary: canMigrate }"
        v-if="canMigrate"
      >
        V2 Migrate
      </button>
    </div>
  </UiTableTr>
</template>

<script>
import { getPoolLiquidity } from '@/helpers/price';
import { getNewPool } from '@/helpers/migration';

export default {
  props: ['pool', 'migratable'],
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    myLiquidity() {
      const poolShares = this.subgraph.poolShares[this.pool.id];
      if (!this.pool.finalized || !poolShares) return 0;
      return (this.poolLiquidity / this.pool.totalShares) * poolShares;
    },
    canMigrate() {
      const newPool = getNewPool(this.pool.id);
      console.log(newPool);
      return !!newPool;
    }
  }
};
</script>

<style scoped>
.button-migrate {
  padding: 2px 4px;
  color: white;
  font-weight: bold;
  background: linear-gradient(270deg, #f0f 0%, #00f 100%);
  border: none;
  border-radius: 5px;
}
</style>
