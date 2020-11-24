<template>
  <div class="bpool-list border-bottom" :class="loading && 'anim-pulse'">
    <div v-if="loading" class="text-center py-4">
      <UiLoading />
    </div>
    <div v-else>
      <div class="position-relative">
        <Favorite
          :id="pool.address"
          class="favorite position-absolute p-3 top-0 right-0"
        />
      </div>
      <router-link
        :to="{ name: 'pool', params: { id: pool.address } }"
        class="d-block d-sm-flex p-3"
      >
        <div v-text="poolType" class="title col-12" />
        <div class="flex-auto pr-0 pr-sm-6">
          <PoolWeights
            :tokens="pool.tokens"
            class="mt-8 mt-sm-6"
            style="max-width: 380px;"
          />
        </div>
        <div class="col-12 col-sm-6" style="max-width: 340px;">
          <div class="d-flex mt-3 mt-sm-0">
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
            <div class="col-4">
              <div class="mb-1">Volume (1d)</div>
              <h4 class="text-white">
                {{ _num(poolMetadata.volume, 'usd') }}
              </h4>
            </div>
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

  @media (min-width: 544px) {
    .title {
      width: 120px !important;
    }
  }

  &:last-child {
    border-bottom: none !important;
  }

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
