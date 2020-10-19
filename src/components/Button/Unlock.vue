<template>
  <UiButton
    @click="handleSubmit"
    type="button"
    class="button-sm"
    v-if="locked"
    :loading="loading"
  >
    {{ $t('unlock') }}
  </UiButton>
</template>

<script>
import { mapActions } from 'vuex';

import { isLocked } from '@/helpers/utils';

export default {
  props: ['tokenAddress', 'amount', 'decimals'],
  data() {
    return {
      loading: false,
      input: false
    };
  },
  computed: {
    locked() {
      const res = isLocked(
        this.web3.allowances,
        this.tokenAddress,
        this.web3.dsProxyAddress,
        this.amount,
        this.decimals || this.web3.tokenMetadata[this.tokenAddress].decimals
      );
      this.$emit('input', res);
      return res;
    }
  },
  methods: {
    ...mapActions(['approve']),
    async handleSubmit() {
      this.loading = true;
      try {
        await this.approve(this.tokenAddress);
        this.$emit('approved', true);
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    }
  }
};
</script>
