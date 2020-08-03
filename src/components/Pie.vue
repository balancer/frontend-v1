<template>
  <UiPie :values="values" :colors="colors" :size="size" />
</template>

<script>
import { getAddress } from '@ethersproject/address';

const unknownColors = [
  '#6f6776',
  '#9a9a97',
  '#c5ccb8',
  '#c38890',
  '#a593a5',
  '#666092',
  '#9a4f50',
  '#c28d75'
];

export default {
  props: ['tokens', 'size'],
  computed: {
    values() {
      return this.tokens.map(token => parseFloat(token.denormWeight));
    },
    colors() {
      let nextColor = 0;
      return this.tokens.map(token => {
        const tokenConfig = this.config.tokens[getAddress(token.address)];
        let chartColor = unknownColors[nextColor];
        if (tokenConfig && tokenConfig.chartColor) {
          chartColor = tokenConfig.chartColor;
        } else {
          nextColor++;
        }
        return chartColor;
      });
    }
  }
};
</script>
