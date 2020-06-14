<template>
  <span class="d-inline-block" style="line-height: 0;">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :style="style"
      class="circle bg-white"
      :title="symbol"
    />
    <span
      :style="style"
      class="circle d-block bg-gray text-center overflow-hidden"
      v-text="symbol"
      v-else
    />
  </span>
</template>

<script>
import { getAddress } from 'ethers/utils';
import config from '@/helpers/config';

export default {
  props: ['address', 'symbol', 'size'],
  computed: {
    style() {
      const size = this.size || 32;
      return {
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: `${size + 2}px`,
        fontSize: `${(size / 3.2).toFixed()}px`
      };
    },
    token() {
      return config.tokens[getAddress(this.address)] || {};
    },
    imageUrl() {
      if (this.address === 'ether')
        return 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png';
      const checksum = getAddress(this.address);
      if (checksum === getAddress(config.addresses.weth))
        return 'https://www.zapper.fi/images/ETH-icon.png';
      if (this.token.iconAddress)
        return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${getAddress(
          this.token.iconAddress
        )}/logo.png`;
      return '';
    }
  }
};
</script>
