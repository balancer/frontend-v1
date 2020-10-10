<template>
  <UiModal :open="open" @close="$emit('close')">
    <UiModalForm @submit="handleSubmit">
      <template slot="header" v-if="stepTitles[step]">
        <h3 class="text-white">
          <span class="mr-2">{{ stepTitles[step] }}</span>
          <span
            v-if="step < lastStep"
            v-text="`${step + 1} / ${lastStep}`"
            class="text-gray"
          />
        </h3>
      </template>
      <FormSelectTokens v-if="step === 0" v-model="tokens" :value="tokens" />
      <FormSelectWeights
        v-if="step === 1"
        v-model="startWeights"
        :value="startWeights"
        :tokens="tokens"
      />
      <FormSelectBalances
        v-if="step === 2"
        v-model="startBalances"
        :value="startBalances"
        :tokens="tokens"
        :startWeights="startWeights"
      />
      <FormSelectSwapFee v-if="step === 3" v-model="swapFee" :value="swapFee" />
      <!-- <FormSelectRights v-if="step === 4" v-model="rights" :value="rights" /> -->
      <FormPreview
        v-if="step === 4"
        :tokens="tokens"
        :startWeights="startWeights"
        :startBalances="startBalances"
        :swapFee="swapFee"
        :rights="rights"
      />
      <FormBroadcast v-if="step === 5" @close="$emit('close')" />
      <template slot="footer" v-if="step <= lastStep">
        <UiButton
          type="button"
          v-if="step !== 0"
          class="d-inline-block column mx-1"
          @click="step--"
        >
          Back
        </UiButton>
        <UiButton
          :disabled="tokens.length < 2 || loading"
          type="submit"
          class="button-blue d-inline-block column mx-1"
          :class="{ 'btn-white': step === 0 }"
        >
          <template v-if="step === lastStep - 1" v-text="$t('preview')" />
          <template v-else-if="step === lastStep" v-text="$t('confirm')" />
          <template v-else v-text="$t('next')" />
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import i18n from '@/i18n';
// import { delay } from '@/helpers/utils';

export default {
  props: ['open'],
  data() {
    return {
      stepTitles: [
        i18n.tc('selectTokens'),
        i18n.tc('set=Weights'),
        i18n.tc('deposit'),
        i18n.tc('setSwapFee'),
        i18n.tc('preview')
      ],
      loading: false,
      step: 0,
      lastStep: 4,
      tokens: [],
      startWeights: [],
      startBalances: [],
      swapFee: '0.15',
      rights: {
        pausableSwap: true,
        configurableSwapFee: true,
        configurableWeights: true,
        configurableAddRemoveTokens: true
      },
      tx: {}
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
    async handleSubmit() {
      if (this.step === this.lastStep) {
        this.loading = true;
        // await delay(1e3);
        this.createPool({
          tokens: this.tokens,
          startBalances: this.startBalances,
          startWeights: this.startWeights,
          swapFee: this.swapFee
          // rights: this.rights
        });
        this.loading = false;
        this.step++;
      } else {
        this.step++;
      }
    }
  }
};
</script>
