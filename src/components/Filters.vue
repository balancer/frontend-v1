<template>
  <div>
    <Sticky v-if="isSticky" class="bg-white">
      <Container class="d-flex">
        <Search class="flex-auto" />
        <a
          v-for="option in options"
          :key="option.key"
          @click="handleChangeOrder(option.key)"
          class="py-4 text-right column"
        >
          {{ option.name }}
        </a>
      </Container>
    </Sticky>
    <Container class="d-flex" v-else>
      <Search class="flex-auto" />
      <a
        v-for="option in options"
        :key="option.key"
        @click="handleChangeOrder(option.key)"
        class="py-4 text-right column"
      >
        {{ option.name }}
      </a>
    </Container>
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
