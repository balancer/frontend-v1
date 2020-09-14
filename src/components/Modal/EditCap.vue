<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Edit cap</h3>
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          Change pool supply cap
        </h5>
        <input
          type="number"
          class="h3 py-2 px-3 input text-center"
          placeholder="100"
          :class="isValid ? 'text-white' : 'text-red'"
          v-model="input"
        />
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
import { validateNumberInput, ValidationError } from '@/helpers/validation';

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
  computed: {
    isValid() {
      const error = validateNumberInput(this.input);
      return error === ValidationError.NONE;
    }
  },
  methods: {
    ...mapActions(['setCap']),
    async handleSubmit() {
      this.loading = true;
      try {
        this.tx = await this.setCap({
          poolAddress: this.pool.controller,
          newCap: this.input
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
