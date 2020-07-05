<template>
  <UiButton
    @click="handleSubmit"
    type="button"
    class="button-sm"
    v-if="!allowance && init"
    :loading="loading"
  >
    Unlock
  </UiButton>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['tokenAddress', 'spender'],
  data() {
    return {
      init: false,
      loading: false,
      input: false
    };
  },
  computed: {
    allowance() {
      return this.web3.proxyAllowances[this.tokenAddress] || 0;
    }
  },
  methods: {
    ...mapActions(['approve', 'getProxyAllowance']),
    async handleSubmit() {
      this.loading = true;
      await this.approve(this.tokenAddress);
      this.loading = false;
    }
  },
  async created() {
    await this.getProxyAllowance(this.tokenAddress);
    this.init = true;
  }
};
</script>
