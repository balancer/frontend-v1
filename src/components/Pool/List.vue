<template>
  <div class="bpool-list p-3 border-bottom" :class="loading && 'anim-pulse'">
    <div v-if="loading" class="text-center">
      <UiLoading class="big mt-2" />
    </div>
    <div v-else>
      <div class="position-relative">
        <Favorite
          :id="pool.address"
          class="favorite position-absolute p-3 top-n3 right-n3"
        />
      </div>
      <router-link
        :to="{ name: 'pool', params: { id: pool.address } }"
        class="overflow-hidden"
      >
        <div v-text="poolType" class="mb-3" />
        <div class="col-4 float-left">
          <PoolWeights :tokens="pool.tokens" class="mt-7 mb-3 mr-4" />
        </div>
        <div class="col-3 float-right">
          <div>
            Swap fee
            <span class="float-right text-white">
              {{ _num(pool.swapFee / 1e18, 'percent') }}
            </span>
          </div>
          <div>
            T.V.L.
            <span class="float-right text-white">
              {{ _num(poolLiquidity, 'usd') }}
            </span>
          </div>
          <div>
            Volume (1d)
            <span class="float-right text-white">
              {{ _num(poolMetadata.volume, 'usd') }}
            </span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getPoolLiquidity } from '@/_balancer/explore';
import registry from '@/_balancer/registry';

export default {
  props: {
    loading: Boolean,
    pool: Object
  },
  computed: {
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    poolMetadata() {
      return registry.metadata[this.pool.address] || {};
    },
    poolType() {
      let type = 'Shared pool';
      if (this.poolMetadata.tags) {
        if (this.poolMetadata.tags.includes('private')) type = 'Private pool';
        if (this.poolMetadata.tags.includes('smart-pool')) type = 'Smart pool';
      }
      return type;
    }
  }
};
</script>

<style lang="scss">
@import '../../vars';

.bpool-list {
  background-color: $panel-background;
  overflow: hidden;

  .favorite {
    display: none;

    &.active {
      display: block !important;
      color: $primary-button-background;
    }
  }

  &:hover {
    .favorite {
      display: block;
    }
  }
}
</style>
