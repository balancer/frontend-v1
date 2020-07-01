<template>
  <div class="d-flex flex-items-center px-4 py-3 text-right">
    <slot />
  </div>
</template>

<script>
export default {
  props: ['to']
};
</script>
