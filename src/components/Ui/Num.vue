<template>
  <span v-text="_n(value, format)" :title="_n(value, 'raw')" />
</template>

<script>
export default {
  props: {
    value: Number,
    format: String
  }
};
</script>
