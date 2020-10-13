<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body p-6 d-flex flex-items-center text-red">
      <Icon name="warning" class="mr-4" />
      <div v-html="$t('highRiskPool')" />
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open']
};
</script>
