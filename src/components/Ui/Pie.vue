<template>
  <span
    class="pie border circle border-black-fade d-inline-block"
    :style="`height: ${size}px; width: ${size}px;`"
  >
    <svg height="20" width="20" viewBox="0 0 20 20">
      <circle
        v-for="(item, i) in dataObjects"
        :key="i"
        :style="{
          height: `${size}px`,
          width: `${size}px`,
          strokeDasharray: `${item.relativeSize} ${circleLength}`,
          strokeDashoffset: item.offset
        }"
        r="5"
        cx="10"
        cy="10"
        fill="transparent"
        :stroke="colors[i]"
        :stroke-offset="item.offset"
        stroke-width="10"
        transform="rotate(-90) translate(-20)"
      />
    </svg>
  </span>
</template>

<script>
export default {
  props: ['values', 'colors', 'size'],
  data() {
    return {
      circleLength: 10 * Math.PI
    };
  },
  computed: {
    dataTotal() {
      return this.values.reduce((a, b) => a + b);
    },
    dataObjects() {
      let startingPoint = 0;
      return this.values.map(item => {
        const relativeSize = (item / this.dataTotal) * this.circleLength;
        const dataObject = {
          relativeSize,
          offset: -startingPoint
        };
        startingPoint += relativeSize;
        return dataObject;
      });
    }
  }
};
</script>

<style lang="scss">
.pie {
  svg {
    height: 100%;
    width: 100%;
  }
}
</style>
