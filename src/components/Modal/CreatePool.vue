<template>
  <Modal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue-1 mosaic anim-scroll': step === 0 }"
    >
      <Progress :step="step" :stepCount="lastStep" />
      <div v-if="!step">
        <img src="~/@/assets/logo.svg" width="50" height="50" />
        <h2 class="mt-7 mb-8 text-blue anim-fade-in col-10 mx-auto">
          Welcome on the smart pool creation wizard
        </h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <FormSelectTokens v-if="step === 1" v-model="tokens" />
        <FormSelectWeights
          v-if="step === 2"
          v-model="weights"
          :tokens="tokens"
        />
        <FormSelectBalances
          v-if="step === 3"
          v-model="balances"
          :tokens="tokens"
          :weights="weights"
        />
        <FormSelectSwapFee v-if="step === 4" />
        <FormSelectRights v-if="step === 5" />
        <FormPreview v-if="step === 6" />
        <div class="mx-3 overflow-hidden">
          <button
            type="button"
            v-if="step !== 0"
            class="btn-outline d-inline-block column mx-1"
            @click="step--"
          >
            Back
          </button>
          <button
            :disabled="step !== 0 && tokens.length < 2"
            type="submit"
            class="btn-mktg d-inline-block column mx-1"
          >
            {{ step === lastStep - 1 ? 'Preview' : 'Next' }}
          </button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open'],
  data() {
    return {
      step: 0,
      lastStep: 6,
      tokens: [],
      weights: [],
      balances: [],
      swapFee: '0.15',
      rights: []
    };
  },
  watch: {
    open() {
      this.step = 0;
      this.tokens = [];
      this.weights = [];
      this.balances = [];
    }
  },
  methods: {
    ...mapActions(['createPool']),
    handleSubmit() {
      if (this.step === this.lastStep) {
        const tokens = this.tokens.map(token => token.address);
        const amounts = this.tokens.map(token => token.amount);
        const weights = this.tokens.map(token => token.weight);
        const fee = '0.1';
        const proxyAddress = this.settings.proxy;
        this.createPool({ proxyAddress, tokens, amounts, weights, fee });
      } else {
        this.step++;
      }
    }
  }
};
</script>
