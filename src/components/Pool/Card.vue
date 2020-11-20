<template>
  <div class="d-block float-left col-12 col-lg-4">
    <Block class="bpool-card p-3 mr-3 mb-3" :class="loading && 'anim-pulse'">
      <div v-if="loading" class="text-center">
        <UiLoading class="big mt-8" />
      </div>
      <div v-else>
        <div class="position-relative">
          <Favorite
            :id="pool.address"
            class="favorite position-absolute p-3 top-n3 right-n3"
          />
        </div>
        <router-link :to="{ name: 'pool', params: { id: pool.address } }">
          <div v-text="poolType" class="mb-3" />
          <PoolWeights :tokens="pool.tokens" class="mt-8 mb-4" />
          <div>
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
    </Block>
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

.bpool-card {
  height: 214px;
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
