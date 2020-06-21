<template>
  <div class="d-flex px-4">
    <div class="flex-auto" />
    <a
      v-for="option in options"
      :key="option.key"
      @click="handleChangeOrder(option.key)"
      class="py-3 my-1 text-right column"
      :class="{ 'hide-sm hide-md': option.hideMobile }"
    >
      {{ option.name }}
    </a>
  </div>
</template>

<script>
export default {
  props: ['options', 'isSticky'],
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
    handleChangeOrder(orderBy) {
      this.orderDirection =
        orderBy === this.orderBy
          ? this.orderDirection === 'asc'
            ? 'desc'
            : 'asc'
          : 'desc';
      this.orderBy = orderBy;
    },
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
