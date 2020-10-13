<template>
  <div id="error" class="d-flex flex-items-center px-4 py-2">
    <UiCheckbox class="error" :checked="accepted" @change="$emit('toggle')" />
    <div class="ml-4">
      <div v-if="custom">
        {{ $t('tokenWarning1') }}
      </div>
      <div v-if="custom">
        {{ $t('tokenWarning2') }}
      </div>
      <div v-if="custom">
        {{ $t('tokenWarning3') }}
      </div>
      <div>
        {{ $t('tokenWarning4') }}
      </div>
      <div>
        {{ $t('tokenWarning5') }}
      </div>
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
