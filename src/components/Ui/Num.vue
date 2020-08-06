<template>
  <span v-text="_num(value, format)" :title="_num(value, 'raw')" />
</template>

<script>
export default {
  props: ['value', 'format']
};
</script>
