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
  font-weight: 500;
  line-height: 20px;
  color: $white;
  background-color: $panel-border;
  border-radius: 2em;
}

.router-link-exact-active {
  .Counter {
    background-color: $blue;
  }
}
</style>
