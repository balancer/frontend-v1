<template>
  <span class="d-inline-block">
    <img
      v-if="trustwalletIcon"
      :src="trustwalletIcon"
      width="32"
      height="32"
      class="circle bg-white"
      :title="symbol"
    />
    <span
      style="width: 32px; height: 32px; line-height: 32px; font-size: 12px;"
      class="circle mr-n1 d-block text-white bg-gray text-center overflow-hidden"
      v-text="symbol"
      v-else
    />
  </span>
</template>

<script>
import { mapState } from 'vuex';
import trustwalletMap from '@/helpers/trustwallet.json';
import { getAddress } from 'ethers/utils';

export default {
  props: ['address', 'symbol'],
  computed: {
    ...mapState(['settings']),
    trustwalletIcon() {
      let path;
      if (trustwalletMap.includes(getAddress(this.address)))
        path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${getAddress(
          this.address
        )}/logo.png`;
      if (
        getAddress(this.address) ===
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
      )
        path = 'https://www.zapper.fi/images/ETH-icon.png';
      return path;
    }
  }
};
</script>
