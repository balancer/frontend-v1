<template>
  <span
    class="Progress Progress--small mb-5 col-2 mx-auto"
    v-if="step && step < stepCount"
  >
    <span
      class="bg-blue"
      :style="`width: ${parseInt((100 / stepCount) * step)}%;`"
    />
  </span>
</template>

<script>
export default {
  props: ['step', 'stepCount']
};
</script>
