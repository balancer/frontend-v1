<template>
  <Sticky class="bg-gray">
    <div class="container-lg p-responsive d-flex">
      <span class="iconfont iconsearch h3 pt-3 mt-1" />
      <input
        class="input h3 py-3 px-2 flex-auto"
        style="height: 68px;"
        placeholder="Search"
        v-model="query"
      />
      <a
        @click="handleChangeOrder('marketcap')"
        class="py-4 text-center hide-sm hide-md"
        style="width: 120px;"
      >
        Marketcap
      </a>
      <a
        @click="handleChangeOrder('volume1Day')"
        class="py-4 text-center hide-sm hide-md"
        style="width: 120px;"
      >
        Vol. 24h
      </a>
      <a
        @click="handleChangeOrder('swapFee')"
        class="py-4 text-center"
        style="width: 120px;"
        >Swap fee</a
      >
      <a
        @click="handleChangeOrder('holders')"
        class="py-4 text-center hide-sm hide-md"
        style="width: 120px;"
      >
        Holders
      </a>
    </div>
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
