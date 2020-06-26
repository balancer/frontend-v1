<template>
  <UiModal :open="open" @close="$emit('close')">
    <div
      class="modal-body py-6 text-center"
      :class="{ 'bg-blue mosaic anim-scroll': step > lastStep }"
    >
      <form @submit.prevent="handleSubmit">
        <div v-if="step === 0">
          <div class="px-4 mb-4 overflow-hidden">
            <h2 class="mb-3">Public swap</h2>
            <p class="mb-3">
              Excepteur sint occaecat cupidatat non proident, sunt in.
            </p>
            <div class="my-6">
              <label
                class="d-block mb-3"
                :class="publicSwap ? 'text-blue' : 'text-gray'"
              >
                {{ publicSwap ? 'Active' : 'Paused' }}
              </label>
              <VueSwitch v-model="publicSwap" />
            </div>
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
              :disabled="loading || publicSwap === value"
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
import { delay } from '@/helpers/utils';

export default {
  props: ['open', 'value'],
  data() {
    return {
      loading: false,
      step: 0,
      lastStep: 0,
      publicSwap: false
    };
  },
  watch: {
    open() {
      this.step = 0;
      this.loading = false;
      this.publicSwap = this.value;
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
