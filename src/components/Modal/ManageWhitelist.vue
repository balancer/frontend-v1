<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('manageWhitelist')" class="text-white" />
      </template>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading"
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
export default {
  props: ['open'],
  data() {
    return {
      loading: false
    };
  },
  watch: {
    open() {
      this.loading = false;
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      try {
        // Call function
        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
