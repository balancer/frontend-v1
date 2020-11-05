<template>
  <jazzicon
    :address="address"
    :diameter="diameter"
    class="d-inline-block v-align-middle line-height-0"
  />
</template>

<script>
export default {
  props: ['address', 'size'],
  computed: {
    diameter() {
      return parseInt(this.size) || 22;
    }
  }
};
</script>
