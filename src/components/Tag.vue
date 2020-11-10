<template>
  <span class="tag">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../vars';

.tag {
  font-size: 14px;
  border-radius: 2em;
  color: #ffffff;
  background: $secondary-button-border;
  padding: 0 14px 0;
  line-height: 27px;
  height: 30px;
  display: inline-block;

  &.active {
    background: $primary-button-background;
  }
}
</style>
