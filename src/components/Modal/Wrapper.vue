<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <h3 class="p-4 mb-0 border-bottom text-center">Wrap ETH to WETH</h3>
    <FormWrapper class="m-4 p-4 border rounded-2" />
  </UiModal>
</template>

<script>
import pkg from '@/../package.json';

export default {
  props: ['open'],
  data() {
    return {
      pkg
    };
  }
};
</script>
