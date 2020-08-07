<template>
  <span class="Counter">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@import '../../vars';

.Counter {
  display: inline-block;
  padding: 0 6px;
  height: 22px;
  line-height: 22px;
  color: $white;
  min-width: 22px;
  text-align: center;
  background-color: $panel-border;
  border-radius: 11px;
}

.router-link-exact-active,
.active {
  .Counter {
    background-color: $blue;
  }
}
</style>
