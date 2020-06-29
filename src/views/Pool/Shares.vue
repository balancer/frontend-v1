<template>
  <UiTable>
    <UiTableHeader>
      <div v-text="'Holder'" class="flex-auto text-left" />
      <div v-text="'Balance'" class="column" />
      <div v-text="'Shares'" class="column" />
    </UiTableHeader>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="5"
      class="overflow-hidden"
    >
      <div v-if="shares.length > 0">
        <UiTableLine v-for="(share, i) in shares" :key="i">
          <div class="text-left flex-auto">
            <a
              :href="_etherscanLink(share.userAddress.id)"
              target="_blank"
              class="d-flex d-block text-white"
            >
              <Avatar :address="share.userAddress.id" size="16" class="mr-3" />
              <div>
                {{ _shorten(share.userAddress.id) }}
                <Icon name="external-link" size="16" class="ml-1" />
              </div>
            </a>
          </div>
          <div class="column">{{ $n(share.balance) }} BPT</div>
          <div class="column">
            {{ $n((100 / pool.totalShares) * share.balance) }}%
          </div>
        </UiTableLine>
      </div>
      <ListLoading
        v-if="loading"
        :classes="['flex-auto text-left', 'column', 'column']"
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

export default {
  props: ['pool'],
  data() {
    return {
      loading: false,
      page: 0,
      shares: []
    };
  },
  methods: {
    ...mapActions(['getPoolShares']),
    async loadMore() {
      if (this.shares.length < this.page * 10) return;
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
