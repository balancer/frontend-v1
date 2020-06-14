<template>
  <i
    class="iconfont"
    :class="`icon${name}`"
    :style="size ? `font-size: ${size}px; line-height: ${size}px;` : ''"
  />
</template>

<script>
export default {
  props: ['name', 'size']
};
</script>

<style scoped lang="scss">
.iconfont {
  font-size: 22px;
  line-height: 22px;
  vertical-align: baseline;
}
</style>
