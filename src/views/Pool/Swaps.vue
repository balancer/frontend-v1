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
          <div
            v-text="$n(swap.poolTotalSwapVolume, 'currency')"
            class="column"
          />
          <div class="column">
            <a
              :href="_etherscanLink(swap.id, 'tx')"
              class="text-white"
              target="_blank"
            >
              {{ _shorten(swap.id) }} <Icon name="external-link" />
            </a>
          </div>
        </UiTableLine>
      </div>
      <ListLoading
        v-if="loading"
        :classes="[
          'flex-auto text-left',
          'column',
          'column',
          'column',
          'column'
        ]"
      />
    </div>
    <div
      v-if="swaps.length === 0 && !loading"
      class="border-top d-flex flex-items-center p-4 text-white"
      v-text="$t('messages.EMPTY_STATE')"
    />
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
      this.loading = false;
    }
  }
};
</script>
