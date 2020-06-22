<template>
  <div ref="chartContainer" class="width-full" />
</template>

<script>
import * as TV from 'lightweight-charts';
import { getAddress } from 'ethers/utils';
import { getMarketChartFromCoinGecko, shorten } from '@/helpers/utils';
import config from '@/helpers/config';

export default {
  props: ['pool'],
  data() {
    return {
      chartInit: false
    };
  },
  methods: {
    async loadChart() {
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
      const lineWidth = 3;
      marketCharts.forEach((marketChart, i) => {
        const tokenAddress = getAddress(this.pool.tokens[i].address);
        const title =
          config.tokens[tokenAddress].symbol || shorten(tokenAddress);
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
    }
  },
  beforeMount() {
    this.loadChart();
  }
};
</script>
