<template>
  <UiTable>
    <UiTableTh>
      <div v-text="$t('holder')" class="flex-auto text-left" />
      <div v-text="$t('balance')" class="column" />
      <div v-text="$t('value')" class="column hide-sm" />
      <div v-text="$t('shares')" class="column" />
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
            {{ $t('bpt') }}
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
      v-text="$t('emptyState')"
    />
  </UiTable>
</template>

<script>
import { mapActions } from 'vuex';
import { ITEMS_PER_PAGE } from '@/helpers/utils';
import { getPoolLiquidity } from '@/helpers/price';

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
    poolLiquidity() {
      return getPoolLiquidity(this.pool, this.price.values);
    },
    bptValue() {
      return parseInt(this.poolLiquidity) / this.pool.totalShares;
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
