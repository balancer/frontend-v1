<template>
  <span class="toggle mt-4">
    <a
      v-for="(name, key) in options"
      :key="key"
      @click="$emit('select', key)"
      :class="value === key && 'active'"
      v-text="name"
    >
    </a>
  </span>
</template>

<script>
export default {
  props: ['value', 'options']
};
</script>

<style scoped lang="scss">
@import '../vars';

.toggle {
  display: inline-block;
  background-color: $secondary-button-background;
  border-radius: 22px;

  a {
    display: inline-block;
    height: 44px;
    line-height: 40px;
    border-radius: 22px;
    color: $secondary-button-text;
    padding: 0 24px 3px;
  }

  .active {
    background-color: $panel-border !important;
  }
}
</style>
