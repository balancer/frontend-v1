<template>
  <div class="border-top">
    <VueLoadingIndicator v-if="loading" class="big py-4" />
    <div v-else>
      <div class="py-4 bg-white">
        <Container>
          <div class="d-flex">
            <h2 class="flex-auto mt-1">Pool {{ pool.id | shorten }}</h2>
            <div class="d-flex">
              <div>
                <button
                  class="btn-mktg ml-2"
                  @click="modalAddLiquidityOpen = true"
                >
                  Add liquidity
                </button>
                <button
                  class="btn-mktg ml-2"
                  @click="modalRemoveLiquidityOpen = true"
                >
                  Remove liquidity
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div class="bg-white py-3">
        <Container>
          <div class="d-flex flex-row">
            <div class="d-flex">
              <Pie
                :tokens="pool.tokens"
                :totalWeight="pool.totalWeight"
                :size="120"
                class="mr-4"
              />
              <div class="flex-auto">
                <p>
                  <label class="d-block text-gray-dark">Swap fee</label>
                  {{ $n(pool.swapFeePercent) }}%
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
            <div id="chart" />
          </div>
        </Container>
      </div>
      <Filters :options="options" />
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
// import { createChart } from 'lightweight-charts';
import { mapActions } from 'vuex';

const options = [
  { key: 'weight', name: 'Weight' },
  { key: 'poolBalance', name: 'Pool balance' },
  { key: 'myPoolValue', name: 'My pool balance' }
];

/*
const container = document.body;
const chart = createChart(container, { width: 600, height: 300 });
const lineSeries = chart.addLineSeries();
lineSeries.setData([
  { time: '2020-06-10', value: 80.01 },
  { time: '2020-06-11', value: 96.63 },
  { time: '2020-06-12', value: 76.64 },
  { time: '2020-06-13', value: 81.89 }
]);
*/

export default {
  path: '/pool/:id',
  data() {
    return {
      options,
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false
    };
  },
  methods: {
    ...mapActions(['getPool'])
  },
  async created() {
    this.loading = true;
    this.pool = await this.getPool(this.id);
    this.loading = false;
  }
};
</script>
