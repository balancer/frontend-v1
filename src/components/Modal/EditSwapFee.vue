<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('editSwapFee')" class="text-white" />
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          {{ $t('swapFeeLimits') }}
        </h5>
        <input
          type="number"
          class="h3 py-2 px-3 input text-center"
          placeholder="0.0001"
          :class="isValid ? 'text-white' : 'text-red'"
          value="0.15"
          step="0.0001"
          min="0.0001"
          max="10"
          v-model="input"
        />
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || !isValid || input === value"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          {{ $t('confirm') }}
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { clone } from '@/helpers/utils';

export default {
  props: ['open', 'value', 'pool'],
  data() {
    return {
      loading: false,
      tx: null,
      input: ''
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.input = clone(this.value);
    }
  },
  computed: {
    isValid() {
      const swapFee = parseFloat(this.input);
      return !(swapFee < 0.0001 || swapFee > 10);
    }
  },
  methods: {
    ...mapActions(['setSwapFee']),
    async handleSubmit() {
      this.loading = true;
      try {
        this.tx = await this.setSwapFee({
          poolAddress: this.pool.controller,
          newFee: this.input
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
