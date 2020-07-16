<template>
  <input type="checkbox" :checked="checked" @change="onChange" />
</template>

<script>
export default {
  props: ['checked', 'onChange']
};
</script>

<style scoped>
input {
  appearance: none;
  background-color: var(--panel-background);
  border: 2px solid var(--error);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
  padding: 9px;
  border-radius: 3px;
  display: inline-block;
  position: relative;

  &:active,
  &:checked:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px 1px 3px rgba(0, 0, 0, 0.1);
  }

  &:checked {
    background-color: var(--error);
    border: 2px solid var(--error);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
      inset 15px 10px -12px rgba(255, 255, 255, 0.1);
    color: #99a1a7;
  }

  &:checked:after {
    content: '\\00AC';
    font-size: 24px;
    position: absolute;
    top: -3px;
    left: 5px;
    color: var(--panel-background);
    rotate: 135deg;
  }
}
</style>
