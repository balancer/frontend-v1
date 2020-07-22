<template>
  <div id="warning" class="p-4 text-left">
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

#warning {
  border: 1px solid $warning;
  border-radius: 4px;
  color: $warning;
}
</style>
