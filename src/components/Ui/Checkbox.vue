<template>
  <input type="checkbox" :checked="checked" @change="$emit('change')" />
</template>

<script>
export default {
  props: ['checked']
};
</script>

<style scoped lang="scss">
@import '../../vars';

input {
  appearance: none;
  background-color: $panel-background;
  border: 2px solid $error;
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
    background-color: $error;
    border: 2px solid $error;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
      inset 15px 10px -12px rgba(255, 255, 255, 0.1);
    color: #99a1a7;
  }

  &:checked:after {
    content: '\00AC';
    font-size: 24px;
    position: absolute;
    top: -5px;
    left: 5px;
    color: $panel-background;
    rotate: 135deg;
  }
}
</style>
