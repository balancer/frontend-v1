<template>
  <button @click="$emit('click')" class="button">
    <span>
      <VueLoadingIndicator v-if="loading" />
      <slot v-else />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    loading: Boolean
  }
};
</script>

<style scoped lang="scss">
@import '../../vars';

.button {
  background-color: $button-background;
  color: $button-text;
  border: 1px solid $button-border;
  border-radius: 22px;
  padding: 0 24px 3px;
  outline: none;
  height: 44px;
  margin: 0;

  &:disabled {
    @extend .button-outline;
    color: $text-gray !important;
    cursor: not-allowed;
  }

  &.button-sm {
    font-size: 12px;
    border-radius: 19px;
    padding: 0 14px;
    height: 36px;
  }

  &.button-outline {
    color: $link-text;
    border: 1px solid $panel-border;
    background-color: transparent;
  }

  &.button-red {
    background-color: $bg-red;
    border-color: $bg-red;
  }

  &.button-green {
    background-color: $bg-green;
    border-color: $bg-green;
  }
}
</style>
