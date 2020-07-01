<template>
  <div>
    <div
      v-for="i in 3"
      :key="i"
      class="py-3 border-top d-flex text-right v-align-middle px-4"
      style="line-height: 0;"
    >
      <div
        v-for="(itemClass, i2) in classes"
        :class="itemClass"
        :key="i2"
        :style="`opacity: ${1 - (i - 1) / 2.5}`"
      >
        <span
          class="bg-gray d-inline-block rounded-1 anim-pulse my-1"
          :style="style"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    classes: Array,
    height: Number
  },
  computed: {
    style() {
      return {
        height: `${this.height || 14}px`,
        width: '40%'
      };
    }
  }
};
</script>
