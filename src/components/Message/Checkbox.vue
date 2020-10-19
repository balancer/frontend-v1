<template>
  <div id="error" class="d-flex flex-items-center px-4 py-2">
    <UiCheckbox class="error" :checked="accepted" @change="$emit('toggle')" />
    <div class="ml-4">
      <div v-if="custom" v-html="$t('tokenWarning1')" />
      <div v-if="custom" v-html="$t('tokenWarning2')" />
      <div v-if="custom" v-html="$t('tokenWarning3')" />
      <div v-html="$t('tokenWarning4')" />
      <div v-html="$t('tokenWarning5')" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['custom', 'accepted']
};
</script>

<style scoped lang="scss">
@import '../../vars';

#error {
  border: 1px solid $error;
  border-radius: 4px;
  color: $error;
}
</style>
