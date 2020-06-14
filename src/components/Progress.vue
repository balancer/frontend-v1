<template>
  <span class="Progress mb-5 col-2 mx-auto bg-blue-1" v-if="step">
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
