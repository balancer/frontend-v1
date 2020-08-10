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
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import * as TV from 'lightweight-charts';

const items = [
  {
    name: 'Volume',
    id: 'VOLUME'
  },
  {
    name: 'Fees',
    id: 'FEES'
  }
];

const options = {
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

export default {
  props: ['pool'],
  data() {
    return {
      activeTab: 'VOLUME',
      items,
      metrics: {},
      chart: null,
      series: null
    };
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
        const color = '#ffffff';
        this.series = this.chart.addLineSeries({
          color,
          priceLineVisible: false
        });
      }
      const data = this.getChartData();
      this.series.setData(data);
      window.onresize = () => {
        this.chart.resize(
          chartContainer.offsetWidth,
          chartContainer.offsetHeight
        );
      };
    },
    getChartData() {
      const data = [];
      const rowKeys = Object.keys(this.metrics);
      for (let i = 1; i < rowKeys.length; i++) {
        const row = this.metrics[rowKeys[i]];
        const previousRow = this.metrics[rowKeys[i - 1]];
        const timestamp = parseFloat(rowKeys[i].split('_')[1]);
        const date = new Date(timestamp);
        let value = 0;
        if (this.activeTab === 'VOLUME') {
          const totalVolume = parseFloat(row[0].poolTotalSwapVolume);
          const previousTotalVolume = parseFloat(
            previousRow[0].poolTotalSwapVolume
          );
          value = totalVolume - previousTotalVolume;
        }
        if (this.activeTab === 'FEES') {
          const totalFee = parseFloat(row[0].poolTotalSwapFee);
          const previousTotalFee = parseFloat(previousRow[0].poolTotalSwapFee);
          value = totalFee - previousTotalFee;
        }
        const dataItem = {
          time: date.toISOString(),
          value
        };
        data.push(dataItem);
      }
      return data;
    }
  },
  async mounted() {
    this.metrics = await this.getPoolMetrics(this.pool.id);
    await this.loadChart();
  }
};
</script>

<style scoped>
.tab {
  line-height: 40px;
  height: 44px;
  overflow: hidden;
  padding: 0 16px;
  border-radius: 4px 4px 0 0;
  font-size: 16px;
  color: #fff;
  display: block;
  cursor: pointer;
}

.tab.active {
  background-color: #41476b;
}
</style>
