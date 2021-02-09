<template>
  <button @click="$emit('click')" class="flex-1 button" :disabled="loading">
    <UiLoading v-if="loading" />
    <slot v-else />
  </button>
</template>

<script>
export default {
  props: {
    loading: Boolean
  }
};
</script>

<style lang="scss" scoped>
@import '../../vars';

.button {
  background: linear-gradient(185deg, #f0f 0%, #00f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 10px;
  outline: none;
  height: 44px;
  line-height: 40px;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  transition: box-shadow 0.25s, transform 0.25s;

  &:hover {
    box-shadow: 0 15px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}
</style>
