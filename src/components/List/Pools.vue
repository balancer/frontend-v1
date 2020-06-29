<template>
  <UiTable>
    <UiTableHeader>
      <div
        v-text="'Pool address'"
        class="column-sm text-left hide-sm hide-md hide-lg"
      />
      <div v-text="'Assets'" class="flex-auto text-left" />
      <div v-text="'Swap fee'" class="column hide-sm hide-md" />
      <div v-text="'Liquidity'" class="column" />
      <div v-text="'My liquidity'" class="column hide-sm hide-md" />
      <div v-text="'Trade vol. (24h)'" class="column hide-sm hide-md hide-lg" />
    </UiTableHeader>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="pools.length > 0">
        <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
      </div>
      <ListLoading
        v-if="loading"
        :classes="[
          'column-sm text-left hide-sm hide-md hide-lg',
          'flex-auto text-left',
          'column hide-sm hide-md',
          'column',
          'column hide-sm hide-md',
          'column hide-sm hide-md hide-lg'
        ]"
      />
    </div>
  </UiTable>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['query'],
  data() {
    return {
      loading: false,
      page: 0,
      pools: []
    };
  },
  watch: {
    query() {
      this.page = 0;
      this.loading = true;
      this.loadMore();
    }
  },
  methods: {
    ...mapActions(['getPools']),
    async loadMore() {
      if (this.pools.length < this.page * 10) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = this.query || {};
      query = { ...query, page };
      const pools = await this.getPools(query);
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
