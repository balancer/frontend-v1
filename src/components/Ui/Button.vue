<template>
  <button @click="$emit('click')" class="button" :disabled="loading">
    <UiLoading v-if="loading" />
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

<style lang="scss">
@import '../../vars';

.button {
  background-color: $secondary-button-background;
  color: $secondary-button-text;
  border: 1px solid $secondary-button-border;
  border-radius: 22px;
  padding: 0 22px 3px;
  outline: none;
  height: 44px;
  line-height: 40px;
  margin: 0;

  &:hover {
    background-color: $secondary-button-background-hover;
  }

  &:disabled {
    background: $button-disabled;
    border: 1px solid $button-disabled;
    color: $button-disabled-text;
    cursor: not-allowed;
  }

  &.button-sm {
    font-size: 12px;
    border-radius: 19px;
    padding: 0 14px;
    height: 36px;
    line-height: 34px;
  }

  &.button-primary {
    background-color: $primary-button-background;
    color: $primary-button-text;
    border-color: $primary-button-border;

    &:hover {
      background-color: $primary-button-background-hover;
    }

    &:disabled {
      background: $button-disabled;
      border: 1px solid $button-disabled;
      color: $button-disabled-text;
      cursor: not-allowed;
    }
  }

  &.button-red {
    border-color: $error;
    color: $error;
  }

  &.notification-red {
    background-color: $error;
    border-color: $error;
  }

  &.notification-green {
    background-color: $bg-green;
    border-color: $bg-green;
  }
}
</style>
