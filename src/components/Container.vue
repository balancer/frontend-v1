<template>
  <div :class="slim ? 'px-0' : 'px-4 px-md-0'" class="container-lg">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    slim: Boolean
  }
};
</script>
