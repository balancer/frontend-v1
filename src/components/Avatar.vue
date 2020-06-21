<template>
  <jazzicon
    :address="address"
    :diameter="parseInt(size) || 64"
    class="d-inline-block v-align-middle"
  />
</template>

<script>
export default {
  props: ['address', 'size']
};
</script>
