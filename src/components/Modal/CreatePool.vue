<template>
  <Modal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue mosaic anim-scroll': step === 0 }"
    >
      <Progress :step="step" :stepCount="lastStep" />
      <div v-if="!step">
        <img src="~/@/assets/logo-white.svg" width="50" height="50" />
        <h2 class="mt-7 mb-8 text-white anim-fade-in col-10 mx-auto">
          Welcome on the smart pool creation wizard
        </h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <FormSelectTokens v-if="step === 1" v-model="tokens" :value="tokens" />
        <FormSelectWeights
          v-if="step === 2"
          v-model="startWeights"
          :value="startWeights"
          :tokens="tokens"
        />
        <FormSelectBalances
          v-if="step === 3"
          v-model="startBalances"
          :value="startBalances"
          :tokens="tokens"
          :startWeights="startWeights"
        />
        <FormSelectSwapFee
          v-if="step === 4"
          v-model="swapFee"
          :value="swapFee"
        />
        <FormSelectRights v-if="step === 5" v-model="rights" :value="rights" />
        <FormPreview
          v-if="step === 6"
          :tokens="tokens"
          :startWeights="startWeights"
          :startBalances="startBalances"
          :swapFee="swapFee"
          :rights="rights"
        />
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
            :class="{ 'btn-white': step === 0 }"
          >
            <template v-if="step === lastStep - 1">Preview</template>
            <template v-else-if="step === lastStep">Confirm</template>
            <template v-else>Next</template>
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
      startWeights: [],
      startBalances: [],
      swapFee: '0.15',
      rights: {
        pausableSwap: true,
        configurableSwapFee: true,
        configurableWeights: true,
        configurableAddRemoveTokens: true
      }
    };
  },
  watch: {
    open() {
      this.step = 0;
      this.tokens = [];
      this.startWeights = [];
      this.startBalances = [];
    }
  },
  methods: {
    ...mapActions(['createPool']),
    handleSubmit() {
      if (this.step === this.lastStep) {
        const tokens = this.tokens.map(token => token.address);
        const amounts = this.tokens.map(token => token.amount);
        const startWeights = this.tokens.map(token => token.weight);
        const fee = '0.1';
        const proxyAddress = this.settings.proxy;
        this.createPool({ proxyAddress, tokens, amounts, startWeights, fee });
      } else {
        this.step++;
      }
    }
  }
};
</script>
