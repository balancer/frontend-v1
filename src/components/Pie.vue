<template>
  <span class="d-inline-block circle border" :style="style" v-if="tokens" />
</template>

<script>
import { getAddress } from '@ethersproject/address';
import config from '@/helpers/config';

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
    style() {
      let acum = 0;
      let nextColor = 0;
      const styles = this.tokens.map(token => {
        const tokenConfig = config.tokens[getAddress(token.address)];
        let chartColor = unknownColors[nextColor];
        if (tokenConfig && tokenConfig.chartColor) {
          chartColor = tokenConfig.chartColor;
        } else {
          nextColor++;
        }
        return `${chartColor} 0 ${(acum += token.weightPercent)}%`;
      });
      return {
        background: `conic-gradient( ${styles.join(',')} )`,
        width: `${this.size || 44}px`,
        height: `${this.size || 44}px`,
        borderColor: '#21222c !important'
      };
    }
  }
};
</script>

<style scoped>
@supports not (background: conic-gradient(red 50%, blue 50%)) {
  span {
    display: none !important;
  }
}
</style>
