<template>
  <div>
    <UiTable>
      <UiTableTh>
        <div v-text="$t('assets')" class="flex-auto text-left" />
        <div v-text="$t('swapFee')" class="column hide-sm hide-md" />
        <div v-text="$t('marketCap')" class="column" />
        <div
          v-text="$t('myLiquidity')"
          class="column hide-sm hide-md hide-lg"
        />
        <div v-text="$t('volume24')" class="column hide-sm hide-md hide-lg" />
      </UiTableTh>
      <div v-if="pools.length > 0">
        <ListMyLiquidityPool v-for="(pool, i) in pools" :key="i" :pool="pool" />
      </div>
      <UiTableTr v-else-if="!loading">
        <div v-text="$t('emptyState')" />
      </UiTableTr>
      <ListLoading
        v-if="loading"
        :classes="[
          'flex-auto text-left',
          'column hide-sm hide-md',
          'column',
          'column hide-sm hide-md hide-lg',
          'column hide-sm hide-md hide-lg'
        ]"
        :height="29"
      />
    </UiTable>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['query'],
  data() {
    return {
      loading: false,
      pools: []
    };
  },
  watch: {
    query() {
      this.load();
    }
  },
  created() {
    this.load();
  },
  methods: {
    ...mapActions(['getPools']),
    async load() {
      this.loading = true;
      this.pools = await this.getPools(this.query);
      this.loading = false;
    }
  }
};
</script>
