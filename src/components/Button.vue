<template>
  <button @click="$emit('click')" class="button" :class="typeClass">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    type: String
  },
  computed: {
    typeClass() {
      return this.type ? `button-${this.type}` : null;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

.button {
  background-color: $button-background;
  color: $button-text;
  border: 1px solid $button-border;
  border-radius: $border-radius;
  padding: 0 18px;
  height: 40px;
  outline: none;

  &.button-outline {
    color: $link-text;
    border: 1px solid $panel-border;
    background-color: transparent;
  }
}
</style>
