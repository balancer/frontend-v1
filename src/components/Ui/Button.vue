<template>
  <button @click="$emit('click')" class="button">
    <VueLoadingIndicator v-if="loading" />
    <slot v-else />
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
  border-radius: $border-radius;
  padding: 0 18px;
  line-height: 1em;
  height: 40px;
  outline: none;

  &:disabled {
    @extend .button-outline;
    color: $text-gray !important;
    cursor: not-allowed;
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
