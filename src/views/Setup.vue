<template>
  <div class="px-0 px-md-5 py-4 d-flex flex-justify-center">
    <div class="col-12 col-md-6 col-lg-4">
      <div class="p-4 panel-background border rounded-1 d-flex flex-column">
        <h3 class="mb-4 px-4 px-md-0">Setup Proxy</h3>
        <div>
          Create proxy contract to manage liquidity on Balancer.
        </div>
        <div class="mt-4 d-flex flex-justify-center">
          <UiButton @click="setup()" v-if="!isInstanceReady" :loading="loading">
            Setup
          </UiButton>
          <UiButton @click="goBack()" v-else>Next</UiButton>
        </div>
        <div class="mt-2" v-if="loading">
          Waiting for 10 block confirmations…
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    ...mapActions(['createProxy']),
    async setup() {
      this.loading = true;
      const tx = await this.createProxy();
      if (!tx) {
        this.loading = false;
        return;
      }
      await tx.wait(10);
      this.loading = false;
    },
    goBack() {
      this.$router.back();
    }
  },
  computed: {
    isInstanceReady() {
      const proxyAddress = this.web3.dsProxyAddress;
      const hasInstance =
        proxyAddress !== '0x0000000000000000000000000000000000000000';
      return hasInstance && !this.loading;
    }
  }
};
</script>
