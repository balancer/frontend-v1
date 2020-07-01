<template>
  <span>
    <router-link
      v-if="to"
      :to="to"
      class="line v-align-middle px-4 py-3 highlight d-flex"
    >
      <slot />
    </router-link>
    <div v-else class="line px-4 py-3 d-flex">
      <slot />
    </div>
  </span>
</template>

<script>
export default {
  props: ['to']
};
</script>

<style scoped lang="scss">
@import '../../../vars';

.line {
  display: flex;
  align-items: center;
  border-top: $border;
  color: $white;
  text-align: right;
}
</style>
