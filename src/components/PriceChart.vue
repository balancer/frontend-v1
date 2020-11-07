<template>
  <div>
    <div class="tabs">
      <ul class="d-flex list-style-none">
        <li
          v-for="(item, i) in items"
          :key="i"
          @click="handleChangeTab(item.id)"
          class="tab"
          :class="{ active: activeTab === item.id }"
        >
          <span v-text="$t(item.name)" />
        </li>
      </ul>
    </div>
    <div
      ref="chartContainer"
      class="mb-4 border rounded-md-1 panel-background"
      style="height: 300px; border-top-left-radius: 0px !important;"
    >
      <UiLoading v-if="loading" class="big d-flex height-full" />
    </div>
  </div>
</template>

<script>
import { swapPrice } from '@/helpers/lbpData';
import * as TV from 'lightweight-charts';

const items = [
  {
    name: 'Price History',
    id: 'PRICE'
  }
];

const options = {
  timeScale: {
    barSpacing: 40,
    drawTicks: false,
    borderVisible: false,
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
  },
  handleScroll: {
    mouseWheel: false
  },
  handleScale: {
    mouseWheel: false,
    pinch: false,
    axisPressedMouseMove: {
      time: false,
      price: false
    }
  }
};

export default {
  props: ['bPool', 'swaps'],
  data() {
    return {
      loading: false,
      activeTab: 'PRICE',
      items,
      chart: null,
      series: null
    };
  },
  computed: {
    chartData() {
      const data = [];
      for (let i = 0; i < this.swaps.length; i++) {
        const swap = this.swaps[i];
        const date = new Date(swap.timestamp * 1e3);

        data.push({
          time: date.toISOString(),
          value: swapPrice(this.bPool, this.config.chainId, swap)
        });
      }

      return data;
    }
  },
  methods: {
    handleChangeTab(tabId) {
      this.activeTab = tabId;
      this.loadChart();
    },
    async loadChart() {
      const chartContainer = this.$refs.chartContainer;
      if (!this.chart) {
        options.width = chartContainer.offsetWidth;
        options.height = chartContainer.offsetHeight;
        this.chart = TV.createChart(chartContainer, options);
        window.onresize = () => {
          const width = Math.min(
            document.body.offsetWidth,
            chartContainer.offsetWidth
          );
          this.chart.resize(width, chartContainer.offsetHeight);
        };
      } else {
        this.chart.removeSeries(this.series);
      }
      const color = '#ffffff';
      if (this.activeTab === 'PRICE') {
        this.series = this.chart.addAreaSeries({
          lineColor: color,
          topColor: `${color}ff`,
          bottomColor: `${color}00`,
          priceLineVisible: false,
          priceFormat: {
            type: 'custom',
            formatter: value => `${this._num(value, 'usd')}`
          }
        });
      }

      this.series.setData(this.chartData);
    }
  },
  async mounted() {
    this.loading = true;
    await this.loadChart();
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped>
@import '../vars';

.tab {
  line-height: 40px;
  height: 44px;
  overflow: hidden;
  padding: 0 16px;
  border-radius: $border-radius $border-radius 0 0;
  font-size: 16px;
  color: #fff;
  display: block;
  cursor: pointer;
}

.tab.active {
  background-color: $blue-900;
}
</style>
