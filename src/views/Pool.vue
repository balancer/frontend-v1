<template>
  <div>
    <VueLoadingIndicator v-if="loading" class="big py-4" />
    <div v-else>
      <div class="bg-white border-top py-4">
        <Container>
          <div class="d-flex mb-4">
            <h2 class="flex-auto mt-2">{{ pool.id | shorten }}</h2>
            <div class="d-flex">
              <div>
                <button
                  class="btn-mktg ml-2"
                  @click="modalAddLiquidityOpen = true"
                >
                  Add liquidity
                </button>
                <button
                  class="btn-outline ml-2"
                  @click="modalRemoveLiquidityOpen = true"
                >
                  Remove liquidity
                </button>
              </div>
            </div>
          </div>
          <div class="d-flex flex-row mb-4">
            <Pie
              :tokens="pool.tokens"
              :totalWeight="pool.totalWeight"
              :size="120"
              class="mr-4"
            />
            <div class="flex-auto">
              <p>
                <label class="d-block">Swap fee</label>
                {{ $n(pool.swapFee * 100) }}%
              </p>
              <div>
                <a
                  :href="`https://pools.balancer.exchange/#/pool/${pool.id}`"
                  target="_blank"
                >
                  See on Balancer
                  <Icon name="external-link" class="ml-1" size="18" />
                </a>
              </div>
              <div>
                <a
                  :href="`https://etherscan.io/address/${pool.id}`"
                  target="_blank"
                >
                  See on Etherscan
                  <Icon name="external-link" class="ml-1" size="18" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <FiltersPoolTokens />
      <Container>
        <ListTokens :pool="pool" />
      </Container>
    </div>
    <ModalAddLiquidity
      :pool="pool"
      :open="modalAddLiquidityOpen"
      @close="modalAddLiquidityOpen = false"
    />
    <ModalRemoveLiquidity
      :pool="pool"
      :open="modalRemoveLiquidityOpen"
      @close="modalRemoveLiquidityOpen = false"
    />
  </div>
</template>

<script>
import { getPool } from '@/helpers/api';

export default {
  path: '/pool/:id',
  data() {
    return {
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false
    };
  },
  async created() {
    this.loading = true;
    this.pool = await getPool(this.id);
    this.loading = false;
  }
};
</script>
