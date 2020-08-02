<template>
  <span class="Label v-align-middle">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../../vars';

.label,
.Label {
  font-size: 15px;
  border-radius: 2em;
  border: 1px solid $highlighted-selector-border;
  color: $highlighted-selector-border;
  padding: 0 9px;
  height: 24px;
  line-height: 24px;
}
</style>
