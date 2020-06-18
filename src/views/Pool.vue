<template>
  <div>
    <VueLoadingIndicator v-if="loading" class="big py-4" />
    <div v-else>
      <div class="border rounded-lg-2 mx-lg-4 mb-4 pt-3 position-relative">
        <div class="position-absolute top-4 left-0 right-0" style="z-index: 9;">
          <Container class="d-flex">
            <h2 class="flex-auto mt-1">Pool {{ pool.id | shorten }}</h2>
            <div class="d-flex">
              <button
                class="btn-outline ml-2"
                @click="modalAddLiquidityOpen = true"
              >
                Add liquidity
              </button>
              <button
                v-if="hasShares"
                class="btn-outline ml-2"
                @click="modalRemoveLiquidityOpen = true"
              >
                Remove liquidity
              </button>
            </div>
          </Container>
        </div>
        <div style="min-height: 300px;">
          <div ref="chartContainer" class="width-full mt-4" />
        </div>
      </div>
      <Container>
        <div v-if="1 === 2" class="d-flex flex-row">
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
        </div>
      </Container>
      <div class="overflow-hidden clearfix">
        <Filters class="overflow-hidden" :options="options" />
        <Container>
          <ListTokens :pool="pool" />
        </Container>
      </div>
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
import * as TV from 'lightweight-charts';
import { mapActions } from 'vuex';
import { getAddress } from 'ethers/utils';
import { getMarketChartFromCoinGecko, shorten } from '@/helpers/utils';
import config from '@/helpers/config';

const options = [
  { key: 'weight', name: 'Weight' },
  { key: 'poolBalance', name: 'Pool balance' },
  { key: 'myPoolValue', name: 'My pool balance' }
];

export default {
  path: '/pool/:id',
  data() {
    return {
      options,
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false,
      chartInit: false
    };
  },
  computed: {
    hasShares() {
      return this.pool.shares.reduce(
        (a, b) =>
          a === true ? true : b.userAddress.id === this.provider.account,
        false
      );
    }
  },
  methods: {
    ...mapActions(['getPool'])
  },
  async updated() {
    if (this.chartInit) return;
    const promises = this.pool.tokens.map(token =>
      getMarketChartFromCoinGecko(token.address)
    );
    const marketCharts = await Promise.all(promises);
    const chartContainer = this.$refs.chartContainer;
    const options = {
      height: 300,
      priceScale: {
        position: 'right',
        borderVisible: false,
        drawTicks: false,
        mode: 2
      },
      timeScale: {
        barSpacing: 30,
        drawTicks: false,
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true
      },
      grid: {
        horzLines: {
          visible: false
        },
        vertLines: {
          visible: false
        }
      },
      layout: {
        backgroundColor: 'transparent'
      }
    };
    const chart = TV.createChart(chartContainer.parentElement, options);
    const lineColor = '#384AFF';
    const lineWidth = 3;
    const series = chart.addAreaSeries({
      title: 'BPT',
      topColor: `${lineColor}00`,
      bottomColor: `${lineColor}00`,
      lineColor,
      lineWidth,
      priceLineVisible: false
    });
    series.applyOptions({ baseLineVisible: true });
    const data = Object.entries(marketCharts[0]).map(row => ({
      time: row[0],
      value: row[1] + 100
    }));
    series.setData(data);
    marketCharts.forEach((marketChart, i) => {
      const tokenAddress = getAddress(this.pool.tokens[i].address);
      const title = config.tokens[tokenAddress].symbol || shorten(tokenAddress);
      const lineColor =
        config.tokens[tokenAddress] && config.tokens[tokenAddress].chartColor
          ? config.tokens[tokenAddress].chartColor
          : 'black';
      const series = chart.addAreaSeries({
        title,
        topColor: `${lineColor}00`,
        bottomColor: `${lineColor}00`,
        lineColor,
        lineWidth,
        priceLineVisible: false
      });
      series.applyOptions({ baseLineVisible: true });
      const data = Object.entries(marketChart).map(row => ({
        time: row[0],
        value: row[1]
      }));
      series.setData(data);
    });
    this.chartInit = true;
  },
  async created() {
    this.loading = true;
    this.pool = await this.getPool(this.id);
    this.loading = false;
  }
};
</script>
