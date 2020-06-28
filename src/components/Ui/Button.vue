<template>
  <button @click="$emit('click')" class="button">
    <slot />
  </button>
</template>

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
    opacity: 0.6;
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
