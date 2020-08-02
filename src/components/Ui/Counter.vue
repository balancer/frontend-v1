<template>
  <span class="Counter">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../../vars';

.Counter {
  display: inline-block;
  padding: 0 8px;
  font-weight: 500;
  height: 22px;
  line-height: 24px;
  color: $white;
  min-width: 22px;
  text-align: center;
  font-size: 14px;
  background-color: $panel-border;
  border-radius: 11px;
}

.router-link-exact-active {
  .Counter {
    background-color: $blue;
  }
}
</style>
