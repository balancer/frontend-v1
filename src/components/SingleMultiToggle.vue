<template>
  <span class="toggle mt-4">
    <UiButton
      v-for="option in options"
      :key="option"
      @click="$emit('select', option)"
      :class="selected === option && 'active'"
      class="border-0"
      type="button"
    >
      {{ action === 'add' ? 'Add' : 'Remove' }}
      {{ option === 'MULTI_ASSET' ? 'all assets' : 'one asset' }}
    </UiButton>
  </span>
</template>

<script>
export default {
  props: ['selected', 'onSelect', 'action'],
  data() {
    return {
      options: ['MULTI_ASSET', 'SINGLE_ASSET']
    };
  },
  created() {
    this.selected = this.options[0];
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

.toggle {
  border-radius: 22px;
  display: inline-block;
  background-color: $secondary-button-background;

  .active {
    background-color: $primary-button-background !important;
  }
}
</style>
