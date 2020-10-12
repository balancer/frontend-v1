<template>
  <span class="d-inline-block" style="line-height: 0;">
    <img
      v-if="tokenLogoUrl"
      :src="tokenLogoUrl"
      :style="style"
      class="circle bg-white"
      :title="symbol"
    />
    <Avatar :style="style" :address="address" v-else />
  </span>
</template>

<script>
import { getTokenLogoUrl } from '@/_balancer/utils';

export default {
  props: ['address', 'symbol', 'size'],
  computed: {
    style() {
      const size = this.size || 22;
      return {
        width: `${size}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
        fontSize: `${(size / 2).toFixed()}px`
      };
    },
    tokenLogoUrl() {
      return getTokenLogoUrl(this.address);
    }
  }
};
</script>
