<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('editController')" class="text-white" />
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          {{ $t('changePoolController') }}
        </h5>
        <div class="d-flex flex-items-center p-4 warning-box text-left mb-4">
          <Icon name="warning" size="22" class="mr-4" />
          <div v-html="$t('changeControllerWarning')" />
        </div>
        <input
          class="h3 py-2 px-3 input text-center"
          :class="isValid ? 'text-white' : 'text-red'"
          v-model="input"
        />
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || input === value"
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
import { isValidAddress } from '@/helpers/utils';

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
      return isValidAddress(this.input);
    }
  },
  methods: {
    ...mapActions(['setController']),
    async handleSubmit() {
      this.loading = true;
      try {
        this.tx = await this.setController({
          poolAddress: this.pool.controller,
          newController: this.input
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
