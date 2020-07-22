<template>
  <div id="error" class="p-4">
    <Icon name="warning" class="mr-4" />
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['text']
};
</script>

<style scoped lang="scss">
@import '../../vars';

#error {
  border: 1px solid $error;
  border-radius: 4px;
  color: $error;
}
</style>
