<template>
  <span class="Label v-align-middle">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../../vars';

.label,
.Label {
  border-radius: 2em;
  border: 1px solid $highlighted-selector-border;
  color: $highlighted-selector-border;
  padding: 0 7px;
  line-height: 18px;
}
</style>
