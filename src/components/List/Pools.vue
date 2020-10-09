<template>
  <div>
    <div v-if="title" class="d-flex flex-items-center px-4 px-md-0 mb-3">
      <h3 class="flex-auto" v-text="title" />
      <Filters v-if="withFilters" :value="filters" v-model="filters" />
    </div>
    <UiTable>
      <UiTableTh>
        <div
          v-text="'Pool address'"
          class="column-sm text-left hide-sm hide-md hide-lg"
        />
        <div v-text="'Assets'" class="flex-auto text-left" />
        <div v-text="'Swap fee'" class="column hide-sm hide-md" />
        <div v-text="'Market cap'" class="column" />
        <div v-text="'My liquidity'" class="column hide-sm hide-md hide-lg" />
        <div v-text="'Volume (24h)'" class="column hide-sm hide-md hide-lg" />
      </UiTableTh>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        class="overflow-hidden"
      >
        <div v-if="pools.length > 0">
          <ListPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
        </div>
        <UiTableTr v-else-if="!loading">
          <div v-text="$t('emptyState')" />
        </UiTableTr>
        <ListLoading
          v-if="loading"
          :classes="[
            'column-sm text-left hide-sm hide-md hide-lg',
            'flex-auto text-left',
            'column hide-sm hide-md',
            'column',
            'column hide-sm hide-md hide-lg',
            'column hide-sm hide-md hide-lg'
          ]"
          :height="29"
        />
      </div>
    </UiTable>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { formatFilters, ITEMS_PER_PAGE } from '@/helpers/utils';

export default {
  props: ['query', 'title', 'withFilters'],
  data() {
    return {
      loading: false,
      page: 0,
      pools: [],
      filters: formatFilters(this.$route.query)
    };
  },
  watch: {
    query() {
      this.page = 0;
      this.loading = true;
      this.loadMore();
    },
    filters() {
      if (!this.withFilters) return;
      this.page = 0;
      this.loading = true;
      this.pools = [];
      let query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) query = {};
      query.filter = 1;
      this.$router.push({ query });
      this.loadMore();
    }
  },
  methods: {
    ...mapActions(['getPools']),
    async loadMore() {
      if (this.pools.length < this.page * ITEMS_PER_PAGE) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = this.query || {};
      if (this.withFilters) {
        const filters = formatFilters(this.filters);
        if (filters.token && filters.token.length > 0) {
          query.where.tokensList_contains = filters.token;
        }
      }
      query = { ...query, page };
      const pools = await this.getPools(query);
      this.pools = this.pools.concat(pools);
      this.loading = false;
    }
  }
};
</script>
