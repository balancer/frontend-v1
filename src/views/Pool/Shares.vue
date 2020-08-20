<template>
  <UiTable>
    <UiTableTh>
      <div v-text="'Holder'" class="flex-auto text-left" />
      <div v-text="'Balance'" class="column" />
      <div v-text="'Value'" class="column hide-sm" />
      <div v-text="'Shares'" class="column" />
    </UiTableTh>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="10"
      class="overflow-hidden"
    >
      <div v-if="shares.length > 0">
        <UiTableTr v-for="(share, i) in shares" :key="i">
          <div class="text-left flex-auto">
            <a
              :href="
                `${_etherscanLink(pool.id, 'token')}?a=${share.userAddress.id}`
              "
              target="_blank"
              class="text-white"
            >
              <Avatar :address="share.userAddress.id" class="mr-2" />
              {{ _shortenAddress(share.userAddress.id) }}
              <Icon name="external-link" size="16" class="ml-1" />
            </a>
          </div>
          <div class="column">
            <UiNum :value="share.balance" class="mr-1" />
            BPT
          </div>
          <UiNum
            :value="bptValue * share.balance"
            format="price"
            class="column hide-sm"
          />
          <UiNum
            :value="((100 / pool.totalShares) * share.balance) / 1e2"
            format="percent"
            class="column"
          />
        </UiTableTr>
      </div>
      <ListLoading
        v-if="loading"
        :classes="['flex-auto text-left', 'column', 'column hide-sm', 'column']"
      />
    </div>
    <div
      v-if="shares.length === 0 && !loading"
      class="border-top d-flex flex-items-center p-4 text-white"
      v-text="$t('messages.EMPTY_STATE')"
    />
  </UiTable>
</template>

<script>
import { mapActions } from 'vuex';
import { ITEMS_PER_PAGE } from '@/helpers/utils';

export default {
  props: ['pool'],
  data() {
    return {
      loading: false,
      page: 0,
      shares: []
    };
  },
  computed: {
    bptValue() {
      return this.pool.liquidity / this.pool.totalShares;
    }
  },
  methods: {
    ...mapActions(['getPoolShares']),
    async loadMore() {
      if (this.shares.length < this.page * ITEMS_PER_PAGE) return;
      this.loading = true;
      this.page++;
      const page = this.page;
      let query = {
        where: {
          poolId: this.pool.id.toLowerCase()
        }
      };
      query = { ...query, page };
      const shares = await this.getPoolShares(query);
      this.shares = this.shares.concat(shares);
      this.loading = false;
    }
  }
};
</script>
