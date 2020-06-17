<template>
  <span class="Progress bg-gray-1 mb-5 col-2 mx-auto" v-if="step">
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
