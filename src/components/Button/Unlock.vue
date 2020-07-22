<template>
  <UiButton
    @click="handleSubmit"
    type="button"
    class="button-sm"
    v-if="!allowance"
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
      loading: false,
      input: false
    };
  },
  computed: {
    allowance() {
      const proxyAddress = this.web3.dsProxyAddress;
      const tokenAllowance = this.web3.allowances[this.tokenAddress];
      if (!tokenAllowance || !tokenAllowance[proxyAddress]) {
        return false;
      }
      const allowance = tokenAllowance[proxyAddress];
      return allowance !== '0';
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
