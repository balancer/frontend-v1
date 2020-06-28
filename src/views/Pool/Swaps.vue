<template>
  <UiTable>
    <UiTableHeader>
      <div v-text="'Time'" class="flex-auto text-left" />
      <div v-text="'Trade in'" class="column" />
      <div v-text="'Trade out'" class="column" />
      <div v-text="'Swap volume'" class="column" />
      <div v-text="'Tx details'" class="column" />
    </UiTableHeader>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="swaps.length > 0">
        <UiTableLine v-for="(swap, i) in swaps" :key="i" :swap="swap">
          <div
            v-text="$d(new Date(swap.timestamp * 1e3), 'short')"
            class="flex-auto text-left"
          />
          <div class="column">
            <Token :address="swap.tokenIn" size="16" class="mr-2" />
            {{ $n(swap.tokenAmountIn) }}
          </div>
          <div class="column">
            {{ $n(swap.tokenAmountOut) }}
            <Token :address="swap.tokenOut" size="16" class="ml-2" />
          </div>
          <div v-text="$n(swap.poolTotalSwapVolume)" class="column" />
          <div class="column">
            {{ swap.id | shorten }} <Icon name="external-link" />
          </div>
        </UiTableLine>
      </div>
      <ListLoadingPool v-if="loading" />
    </div>
    <div
      v-if="swaps.length === 0 && !loading"
      class="border-top d-flex flex-items-center p-4 text-white"
    >
      Nothing to see here.
    </div>
  </UiTable>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['pool'],
  data() {
    return {
      loading: false,
      page: 0,
      swaps: []
    };
  },
  methods: {
    ...mapActions(['getPoolSwaps']),
    async loadMore() {
      if (this.swaps.length < this.page * 10) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = {
        where: {
          poolAddress: this.pool.id.toLowerCase()
        }
      };
      query = { ...query, page };
      const swaps = await this.getPoolSwaps(query);
      this.swaps = this.swaps.concat(swaps);
      console.log(this.swaps);
      this.loading = false;
    }
  }
};
</script>
