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
  props: ['tokenAddress', 'amount'],
  data() {
    return {
      loading: false,
      input: false
    };
  },
  computed: {
    locked() {
      return isLocked(
        this.web3.allowances,
        this.tokenAddress,
        this.web3.dsProxyAddress,
        this.amount,
        this.web3.tokenMetadata[this.tokenAddress].decimals
      );
    }
  },
  methods: {
    ...mapActions(['approve']),
    async handleSubmit() {
      this.loading = true;
      await this.approve(this.tokenAddress);
      this.loading = false;
    }
  }
};
</script>
