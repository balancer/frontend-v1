<template>
  <div class="px-0 px-md-5 py-4">
    <VueLoadingIndicator v-if="loading" class="big" />
    <div v-else>
      <div class="d-flex flex-items-center flex-auto mb-4 px-4 px-md-0">
        <h3 class="flex-auto">
          <span class="mr-2">Pool {{ _shorten(pool.id) }}</span>
          <UiLabel v-if="!pool.finalized" v-text="'Private'" />
        </h3>
        <div class="d-flex">
          <UiButton
            class="ml-2"
            @click="modalAddLiquidityOpen = true"
            v-if="enableAddLiquidity"
          >
            Add liquidity
          </UiButton>
          <UiButton
            v-if="hasShares"
            class="button-outline ml-2"
            @click="modalRemoveLiquidityOpen = true"
          >
            Remove liquidity
          </UiButton>
        </div>
      </div>
      <div
        class="border-left-0 border-right-0 border border-md rounded-lg-2 mb-4 position-relative panel-background"
      >
        <div v-if="pool.id" style="min-height: 300px;">
          <Chart :pool="pool" />
        </div>
      </div>
      <PoolBoxes :pool="pool" />
      <Tabs :pool="pool" />
      <router-view :key="$route.path" :pool="pool" />
    </div>
    <ModalAddLiquidity
      :pool="pool"
      :open="modalAddLiquidityOpen"
      @close="modalAddLiquidityOpen = false"
    />
    <ModalRemoveLiquidity
      :pool="pool"
      :open="modalRemoveLiquidityOpen"
      @close="modalRemoveLiquidityOpen = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import config from '@/helpers/config';

export default {
  data() {
    return {
      count: 0,
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false,
      chartInit: false
    };
  },
  computed: {
    hasShares() {
      return Object.keys(this.subgraph.poolShares).includes(this.id);
    },
    enableAddLiquidity() {
      return this.pool.tokensList.reduce(
        (a, b) => (config.errors.includes(b) ? false : a),
        this.pool.finalized
      );
    }
  },
  methods: {
    ...mapActions(['getPool'])
  },
  async created() {
    if (this.count === 0) {
      this.count++;
      this.loading = true;
      this.pool = await this.getPool(this.id);
      this.loading = false;
    }
  }
};
</script>
