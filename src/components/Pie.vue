<template>
  <UiPie :values="values" :colors="colors" :size="size" />
</template>

<script>
import { getAddress } from '@ethersproject/address';

const unknownColors = [
  '#5d6872',
  '#7e9e99',
  '#9d9f7f',
  '#68aca9',
  '#a593a5',
  '#387080',
  '#c7bdf4',
  '#c28d75',
  '#be955c',
  '#8d6268',
  '#416aa3',
  '#6f6776',
  '#557064',
  '#6e6962',
  '#6eaa78',
  '#93a167',
  '#220730',
  '#9a4f50',
  '#666092',
  '#c38890',
  '#8b5580',
  '#c5ccb8',
  '#9a9a97',
  '#5d2e9a',
  '#433455',
  '#7ca1c0',
  '#628b8d'
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
        let color = unknownColors[nextColor];
        if (tokenConfig && tokenConfig.color) {
          color = tokenConfig.color;
        } else {
          nextColor++;
        }
        return color;
      });
    }
  }
};
</script>
