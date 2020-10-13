<template>
  <div class="px-0 px-md-5 py-4 d-flex flex-justify-center">
    <div class="col-12 col-md-6 col-lg-4 mt-8">
      <div class="p-4 panel-background border rounded-1 d-flex flex-column">
        <h3 v-text="$t('setupProxy')" class="mb-4 px-4 px-md-0" />
        <div v-text="$t('createProxy')" />
        <div class="mt-4 d-flex flex-justify-center">
          <UiButton
            @click="setup()"
            v-if="!isInstanceReady"
            :loading="loading"
            :disabled="loading"
            class="button-primary"
          >
            {{ $t('setup') }}
          </UiButton>
          <UiButton @click="goBack()" v-else>Next</UiButton>
        </div>
        <div class="mt-2" v-if="loading">
          {{ $t('waitingConfirmation') }}: {{ confirmations }}/10
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
      loading: false,
      confirmations: 0
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
      for (let i = 0; i < 10; i++) {
        await tx.wait(i);
        this.confirmations++;
      }
      this.loading = false;
    },
    goBack() {
      this.$router.back();
    }
  },
  computed: {
    isInstanceReady() {
      return this.web3.dsProxyAddress && !this.loading;
    }
  }
};
</script>
