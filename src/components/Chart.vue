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
          <span>{{ item.name }}</span>
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
import { mapActions } from 'vuex';
import * as TV from 'lightweight-charts';
import i18n from '@/i18n';

const items = [
  {
    name: i18n.tc('liquidity'),
    id: 'LIQUIDITY'
  },
  {
    name: i18n.tc('volume'),
    id: 'VOLUME'
  },
  {
    name: i18n.tc('feeReturns'),
    id: 'FEE_RETURNS'
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

function normalizeMetrics(rawMetrics) {
  const keys = Object.keys(rawMetrics);
  const metrics = {};
  for (let i = 0; i < keys.length; i++) {
    if (rawMetrics[keys[i]].length) {
      metrics[keys[i]] = rawMetrics[keys[i]][0];
    } else {
      metrics[keys[i]] = metrics[keys[i - 1]];
    }
  }
  return metrics;
}

export default {
  props: ['pool'],
  data() {
    return {
      loading: false,
      activeTab: 'LIQUIDITY',
      items,
      metrics: {},
      chart: null,
      series: null
    };
  },
  computed: {
    chartData() {
      const data = [];
      const rowKeys = Object.keys(this.metrics);
      for (let i = 1; i < rowKeys.length; i++) {
        const timestamp = parseFloat(rowKeys[i].split('_')[1]);
        const date = new Date(timestamp);
        const values = this.metrics[rowKeys[i]];
        const previousValues = this.metrics[rowKeys[i - 1]];
        if (!values || !previousValues) {
          data.push({
            time: date.toISOString()
          });
          continue;
        }
        let value;
        if (this.activeTab === 'LIQUIDITY')
          value = parseFloat(values.poolLiquidity);
        if (this.activeTab === 'VOLUME') {
          const totalVolume = parseFloat(values.poolTotalSwapVolume);
          const previousTotalVolume = parseFloat(
            previousValues.poolTotalSwapVolume
          );
          value = totalVolume - previousTotalVolume;
        }
        if (this.activeTab === 'FEE_RETURNS') {
          const totalFee = parseFloat(values.poolTotalSwapFee);
          const previousTotalFee = parseFloat(previousValues.poolTotalSwapFee);
          const dailyFee = totalFee - previousTotalFee;
          const liquidity = parseFloat(values.poolLiquidity);
          value = (dailyFee / liquidity) * 365;
        }
        data.push({
          time: date.toISOString(),
          value
        });
      }
      return data;
    }
  },
  methods: {
    ...mapActions(['getPoolMetrics']),
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
      if (this.activeTab === 'LIQUIDITY') {
        this.series = this.chart.addAreaSeries({
          lineColor: color,
          topColor: `${color}ff`,
          bottomColor: `${color}00`,
          priceLineVisible: false,
          priceFormat: {
            type: 'custom',
            formatter: value => `${this._num(value, 'currency')}`
          }
        });
      }
      if (this.activeTab === 'VOLUME') {
        this.series = this.chart.addHistogramSeries({
          color,
          priceFormat: {
            type: 'custom',
            formatter: value => `${this._num(value, 'currency')}`
          }
        });
      }
      if (this.activeTab === 'FEE_RETURNS') {
        this.series = this.chart.addAreaSeries({
          lineColor: color,
          topColor: `${color}ff`,
          bottomColor: `${color}00`,
          priceLineVisible: false,
          priceFormat: {
            type: 'custom',
            formatter: value => `${this._num(value, 'percent')}`
          }
        });
      }
      this.series.setData(this.chartData);
    }
  },
  async mounted() {
    this.loading = true;
    const metrics = await this.getPoolMetrics(this.pool.id);
    this.metrics = normalizeMetrics(metrics);
    this.loading = false;
    await this.loadChart();
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
