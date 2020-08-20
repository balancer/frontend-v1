<template>
  <a @click="$emit('change')" class="checkbox">
    <Icon
      class="checkbox"
      :name="checked ? 'checkbox-on' : 'checkbox-off'"
      size="32"
    />
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
@import '../../vars';

.checkbox {
  .iconfont {
    color: $info;
  }

  &.error {
    .iconfont {
      color: $error;
    }
  }
}
</style>
