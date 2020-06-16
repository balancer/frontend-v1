<template>
  <div>
    <div v-if="isFixed" :style="`height: ${offsetHeight}px;`" />
    <div
      id="sticky"
      :class="{ 'position-fixed width-full top-0 bg-blue-light': isFixed }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isFixed: false,
      offsetTop: -1,
      offsetHeight: 0
    };
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
    const el = document.getElementById('sticky');
    this.offsetTop = el.offsetTop;
    this.offsetHeight = el.offsetHeight;
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  },
  methods: {
    onScroll(e) {
      const windowTop = e.target.documentElement.scrollTop;
      this.isFixed = windowTop >= this.offsetTop;
    }
  }
};
</script>
