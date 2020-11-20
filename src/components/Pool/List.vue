<template>
  <Block class="bpool-list p-3 mb-3 border-bottom" :class="loading && 'anim-pulse'">
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
        <div v-text="poolType" class="col-2 float-left" />
        <div class="col-4 float-left">
          <PoolWeights :tokens="pool.tokens" class="mt-6 mr-4" />
        </div>
        <div class="col-6 float-right">
          <div class="d-flex ml-4">
            <div class="col-4">
              <div class="mb-1">Swap fee</div>
              <h4 class="text-white">
                {{ _num(pool.swapFee / 1e18, 'percent') }}
              </h4>
            </div>
            <div class="col-4">
              <div class="mb-1">T.V.L.</div>
              <h4 class="text-white">
                {{ _num(poolLiquidity, 'usd') }}
              </h4>
            </div>
            <div style="col-4">
              <div class="mb-1">Volume (1d)</div>
              <h4 class="text-white">
                {{ _num(poolMetadata.volume, 'usd') }}
              </h4>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </Block>
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
