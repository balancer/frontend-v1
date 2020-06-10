<template>
  <Sticky class="bg-gray">
    <Container class="d-flex text-center">
      <span class="iconfont iconsearch h3 pt-3 mt-1" />
      <input
        class="input h3 py-3 px-2 flex-auto"
        style="height: 68px;"
        placeholder="Search"
        v-model="query"
      />
      <div class="column py-4">Weight</div>
      <div class="column py-4">Pool balance</div>
      <div class="column py-4">My pool balance</div>
      <div class="column py-4">My asset value</div>
    </Container>
  </Sticky>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      orderBy: '',
      orderDirection: 'desc'
    };
  },
  watch: {
    query() {
      this.emitFilters();
    },
    orderBy() {
      this.emitFilters();
    },
    orderDirection() {
      this.emitFilters();
    }
  },
  methods: {
    emitFilters() {
      this.$emit('input', {
        query: this.query,
        orderBy: this.orderBy,
        orderDirection: this.orderDirection
      });
    }
  }
};
</script>
