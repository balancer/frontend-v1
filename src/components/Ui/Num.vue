<template>
  <span v-text="_num(value, format)" :title="_num(value, 'long')" />
</template>

<script>
export default {
  props: ['value', 'format']
};
</script>
