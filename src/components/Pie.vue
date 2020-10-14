<template>
  <UiPie :values="values" :colors="colors" :size="size" />
</template>

<script>
export default {
  props: ['tokens', 'size'],
  computed: {
    values() {
      return this.tokens.map(token => parseFloat(token.denormWeight));
    },
    colors() {
      return this.tokens.map(token => token.color);
    }
  }
};
</script>
