<template>
  <span class="d-inline-block" style="line-height: 0;">
    <img
      v-if="trustwalletIcon"
      :src="trustwalletIcon"
      :width="size || 32"
      :height="size || 32"
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
import { mainnet } from '@/constants.json';

export default {
  props: ['address', 'symbol', 'size'],
  computed: {
    ...mapState(['settings']),
    trustwalletIcon() {
      const checksum =
        this.address === 'ether' ? mainnet.weth : getAddress(this.address);
      if (checksum === mainnet.weth && this.address !== 'ether')
        return 'https://www.zapper.fi/images/ETH-icon.png';
      let path;
      if (trustwalletMap.includes(checksum))
        path = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${checksum}/logo.png`;
      return path;
    }
  }
};
</script>
