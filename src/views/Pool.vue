<template>
  <div>
    <VueLoadingIndicator v-if="loading" class="big" />
    <div v-else>
      <h3 class="flex-auto mb-4">Pool {{ pool.id | shorten }}</h3>
      <div
        class="border rounded-lg-2 mb-4 pt-3 position-relative panel-background"
      >
        <div class="position-absolute top-4 left-0 right-0" style="z-index: 9;">
          <div class="d-flex px-4">
            <div class="d-flex">
              <Button class="ml-2" @click="modalAddLiquidityOpen = true">
                Add liquidity
              </Button>
              <Button
                v-if="hasShares"
                class="ml-2"
                @click="modalRemoveLiquidityOpen = true"
              >
                Remove liquidity
              </Button>
            </div>
          </div>
        </div>
        <div style="min-height: 300px;">
          <div ref="chartContainer" class="width-full" />
        </div>
      </div>
      <div class="overflow-hidden mb-4 ml-n2 mr-n2 text-center">
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2"><Price :amount="pool.totalEthValue" /></h2>
            <h4>Liquidity</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2"><Price :amount="pool.totalVolume1Day" /></h2>
            <h4>Trade volume (24hr)</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2">{{ $n(pool.swapFeePercent) }}%</h2>
            <h4>Pool swap fee</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2">0%</h2>
            <h4>My pool share</h4>
          </div>
        </div>
      </div>

      <Tabs :pool="pool" />
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
              <label class="d-block">Swap fee</label>
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
      <router-view :key="$route.path" :pool="pool" />
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

export default {
  data() {
    return {
      count: 0,
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
        (a, b) => (a === true ? true : b.userAddress.id === this.web3.account),
        false
      );
    }
  },
  methods: {
    ...mapActions(['getPool'])
  },
  async updated() {
    if (this.chartInit) return;
    this.chartInit = true;
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
        backgroundColor: 'transparent',
        textColor: 'white'
      }
    };
    const chart = TV.createChart(chartContainer.parentElement, options);
    const lineColor = '#FFFFFF';
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
  },
  async created() {
    if (this.count === 0) {
      this.count++;
      this.loading = true;
      this.pool = await this.getPool(this.id);
      this.loading = false;
    }
  }
};
</script>
