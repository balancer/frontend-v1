<template>
  <div id="error" class="d-flex flex-items-center px-4 py-3">
    <div class="mr-2">
      <div v-html="$t('tokenWarning1')" />
      <div class="mt-2" v-if="custom" v-html="$t('tokenWarning2')" />
    </div>
    <UiButton class="button-red button-accept" @click="$emit('accept')">
      I agree
    </UiButton>
  </div>
</template>

<script>
export default {
  props: ['custom']
};
</script>

<style scoped lang="scss">
@import '../../vars';

#error {
  border: 1px solid $error;
  border-radius: 4px;
  color: $error;
}

.button-accept {
  width: 120px;
}
</style>
