<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Edit public swap</h3>
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          Enable or pause trading in your pool.
        </h5>
        <div class="my-6">
          <div class="d-block h4 mb-3">
            {{ input ? 'Active' : 'Paused' }}
          </div>
          <VueSwitch v-model="input" />
        </div>
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          Cancel
        </UiButton>
        <UiButton
          :disabled="loading || input === value"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          Confirm
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open', 'value', 'pool'],
  data() {
    return {
      loading: false,
      input: false
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.input = this.value;
    }
  },
  methods: {
    ...mapActions(['setPublicSwap']),
    async handleSubmit() {
      this.loading = true;
      try {
        this.tx = await this.setPublicSwap({
          poolAddress: this.pool.controller,
          publicSwap: this.input
        });
        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
