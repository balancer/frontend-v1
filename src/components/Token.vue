<template>
  <span
    class="circle bg-white overflow-hidden d-inline-block"
    style="line-height: 0;"
  >
    <img
      v-if="tokenLogoUrl && !loadingFailed"
      :src="tokenLogoUrl"
      :style="style"
      :title="symbol"
      @error="handleError"
    />
    <Avatar :size="size" :address="address" v-else />
  </span>
</template>

<script>
import { getTokenLogoUrl } from '@/_balancer/utils';

export default {
  props: ['address', 'symbol', 'size', 'custom'],
  data() {
    return {
      loadingFailed: false
    };
  },
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
      if (this.custom)
        return `https://raw.githubusercontent.com/balancer-labs/assets/master/assets/${this.address.toLowerCase()}.png`;
      return getTokenLogoUrl(this.address);
    }
  },
  methods: {
    handleError() {
      this.loadingFailed = true;
    }
  }
};
</script>
