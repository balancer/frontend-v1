<template>
  <UiModal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue mosaic anim-scroll': step > lastStep }"
    >
      <form @submit.prevent="handleSubmit">
        <div v-if="step === 0">
          <FormSelectTokens v-model="tokens" :value="tokens" />
          <div class="text-left mx-4 mb-4">
            <label class="d-block text-center"
              >Time lock to add token (in block)</label
            >
            <input
              v-model="addTokenTimeLockInBlocks"
              type="number"
              class="h2 border-0 form-control text-center width-full"
              placeholder="1"
              min="1"
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
              :disabled="
                loading ||
                  JSON.stringify(tokens) === JSON.stringify(value) ||
                  tokens.length < 2
              "
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
      tokens: [],
      addTokenTimeLockInBlocks: 64
    };
  },
  watch: {
    open() {
      this.step = 0;
      this.loading = false;
      this.tokens = clone(this.value);
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
