<template>
  <span class="d-inline-block circle" :style="style" />
</template>

<script>
import { getAddress } from 'ethers/utils';

const unknownColors = [
  '#bbc0d9',
  '#b0c8cb',
  '#aac7b8',
  '#c7c5ab',
  '#c4a9a9',
  '#bca1bd',
  '#9a9a9a',
  '#494949'
];

const tokenColors = {
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': '#627eea', // WETH
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': '#fab830', // DAI
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': '#2874ca', // USDC
  '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': '#5dbdac', // MKR
  '0x514910771AF9Ca656af840dff83E8264EcF986CA': '#2959da', // LINK
  '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F': '#908d9a', // SNX
  '0xdd974D5C2e2928deA5F71b9825b8b646686BD200': '#01b693', // KNC
  '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828': '#ff4948', // UMA
  '0x0D8775F648430679A709E98d2b0Cb6250d2887EF': '#ff5703', // BAT
  '0x0000000000085d4780B73119b644AE5ecd22b376': '#012867', // TUSD
  '0x9Cb2f26A23b8d89973F08c957C4d7cdf75CD341c': '#0ba3ef', // DZAR
  '0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd': '#fc02a7', // BTC++
  '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51': '#1e1b31', // sUSD
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': '#f08e19', // WBTC
  '0xB4EFd85c19999D84251304bDA99E90B92300Bd93': '#ff915a', // RPL
  '0xD7EFB00d12C2c13131FD319336Fdf952525dA2af': '#4501e2' // XPR
};

export default {
  props: ['tokens', 'totalWeight', 'size'],
  computed: {
    style() {
      let acum = 0;
      const styles = this.tokens.map((token, i) => {
        const color = tokenColors[getAddress(token.address)]
          ? tokenColors[getAddress(token.address)]
          : unknownColors[i];
        const percent = (100 / this.totalWeight) * token.denormWeight;
        return `${color} 0 ${(acum += percent)}%`;
      });
      return {
        background: `radial-gradient(white 25%, transparent 26%), conic-gradient( ${styles.join(
          ','
        )} )`,
        width: `${this.size || 44}px`,
        height: `${this.size || 44}px`
      };
    }
  },
  methods: {
    getAddress
  }
};
</script>
