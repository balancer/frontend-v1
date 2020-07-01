<template>
  <div class="d-flex position-relative">
    <Icon name="search" class="h3 px-1 py-2 my-1 position-absolute left-2" />
    <input
      class="input pl-6 flex-auto"
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
