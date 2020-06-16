<template>
  <div class="d-flex">
    <Icon name="search" class="h3 pt-3 mt-1" />
    <input
      class="input h3 py-3 px-2 flex-auto"
      style="height: 68px;"
      :placeholder="placeholder || 'Search'"
      @input="handleInput"
      type="text"
      autocorrect="off"
      autocapitalize="none"
    />
  </div>
</template>

<script>
export default {
  props: ['value', 'placeholder'],
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
    }
  }
};
</script>
