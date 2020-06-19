<template>
  <img
    class="avatar circle"
    style="vertical-align: middle;"
    :width="size || 64"
    :height="size || 64"
    :src="address | blockie"
  />
</template>

<script>
export default {
  props: ['address', 'size']
};
</script>
