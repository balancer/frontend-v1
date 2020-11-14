<template>
  <div class="d-block float-left col-12 col-lg-4">
    <Block class="b-pool-block p-3 mr-3 mb-3" :class="loading && 'anim-pulse'">
      <template v-if="loading">
        <div class="text-center">
          <UiLoading class="big mt-8" />
        </div>
      </template>
      <div v-else>
        <div class="position-relative">
          <Favorite
            :id="pool.address"
            class="favorite position-absolute p-3 top-n3 right-n3"
          />
        </div>
        <router-link :to="{ name: 'pool', params: { id: pool.address } }">
          <div class="mb-3">
            {{ pool.finalized ? 'Shared pool' : 'Private pool' }}
          </div>
          <div class="mt-8 mb-4">
            <span class="Progress position-relative">
              <span
                v-for="(token, i) in pool.poolTokens"
                :key="i"
                :style="
                  `background-color: ${token.color}; width: ${token.weight}%;`
                "
                class="Progress-item text-center text-white"
              >
                <span
                  :style="`left: ${i * 35}px`"
                  class="position-absolute bottom-3 pr-2"
                >
                  <Token
                    :size="30"
                    :address="token.address"
                    class="b-pool-block--logo border"
                  />
                </span>
                <span
                  class="position-absolute bottom-4 pb-1 right-0 b-pool-block--percent"
                >
                  {{ token.symbol }}
                  {{ _num(token.weight / 100, 'percent') }}
                </span>
              </span>
            </span>
          </div>
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
                {{ _num(poolVolume, 'usd') }}
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
    poolVolume() {
      return registry.volumes[this.pool.address] || 0;
    }
  }
};
</script>

<style lang="scss">
@import '../../vars';

.b-pool-block {
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

  .Progress {
    background-color: transparent !important;
    overflow: visible !important;

    .b-pool-block--percent {
      display: none;
    }

    &:hover {
      .Progress-item {
        opacity: 0.1;
      }

      .Progress-item:hover {
        opacity: 1;

        .b-pool-block--percent {
          display: block;
        }
      }
    }

    .Progress-item {
      &:first-child {
        border-radius: 7px 0 0 7px !important;
      }

      &:last-child {
        border-radius: 0 7px 7px 0 !important;
      }
    }
  }
}
</style>
