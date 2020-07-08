<template>
  <UiTable>
    <UiTableTh>
      <div v-text="'Time'" class="flex-auto text-left" />
      <div v-text="'Trade in'" class="column-lg text-left" />
      <div v-text="'Trade out'" class="column-lg text-left" />
      <div v-text="'Transaction'" class="column" />
    </UiTableTh>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="swaps.length > 0">
        <UiTableTr v-for="(swap, i) in swaps" :key="i" :swap="swap">
          <div
            v-text="$d(new Date(swap.timestamp * 1e3), 'long')"
            class="flex-auto text-left"
          />
          <div class="column-lg d-flex flex-items-center">
            <Token :address="swap.tokenIn" class="mr-2" />
            {{ $n(swap.tokenAmountIn) }}
            {{ swap.tokenInSym }}
          </div>
          <div class="column-lg d-flex flex-items-center">
            <Token :address="swap.tokenOut" class="mr-2" />
            {{ $n(swap.tokenAmountOut) }}
            {{ swap.tokenOutSym }}
          </div>
          <div class="column">
            <a
              :href="_etherscanLink(getTxHashFromId(swap.id), 'tx')"
              class="text-white"
              target="_blank"
            >
              {{ _shorten(getTxHashFromId(swap.id)) }}
              <Icon name="external-link" />
            </a>
          </div>
        </UiTableTr>
      </div>
      <ListLoading
        v-if="loading"
        :classes="[
          'flex-auto text-left',
          'column-lg text-left',
          'column-lg text-left',
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
    },
    getTxHashFromId(id) {
      return id.split('-')[0];
    }
  }
};
</script>
