<template>
  <UiModal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue mosaic anim-scroll': step > lastStep }"
    >
      <form @submit.prevent="handleSubmit">
        <div v-if="step === 0">
          <div class="px-4 mb-4 overflow-hidden">
            <h2 class="mb-3">Swap fee</h2>
            <p class="mb-3">
              Excepteur sint occaecat cupidatat non proident, sunt in.
            </p>
          </div>
          <div class="mb-4">
            <label class="d-block">Swap fee (%)</label>
            <input
              type="number"
              class="h1 border-0 form-control width-fit text-center"
              placeholder="0.0001"
              value="0.15"
              step="0.0001"
              min="0.0001"
              max="10"
              v-model="swapFee"
            />
          </div>
          <div class="mx-3 overflow-hidden">
            <button
              type="button"
              class="btn-outline d-inline-block column mx-1"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              :disabled="loading || swapFee === value"
              type="submit"
              class="btn-mktg d-inline-block column mx-1"
            >
              Confirm
            </button>
          </div>
        </div>
        <FormBroadcast v-if="step === 1" @close="$emit('close')" />
      </form>
    </div>
  </UiModal>
</template>

<script>
import { delay, clone } from '@/helpers/utils';

export default {
  props: ['open', 'value'],
  data() {
    return {
      loading: false,
      step: 0,
      lastStep: 0,
      swapFee: ''
    };
  },
  watch: {
    open() {
      this.step = 0;
      this.loading = false;
      this.swapFee = clone(this.value);
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      await delay(1e3);
      // @TODO Broadcast tx
      this.loading = false;
      this.step++;
    }
  }
};
</script>
