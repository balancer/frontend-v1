<template>
  <div class="px-0 px-md-5 py-4">
    <VueLoadingIndicator v-if="loading" class="big" />
    <div v-else>
      <div class="d-flex flex-items-center flex-auto mb-4 px-4 px-md-0">
        <h3 class="flex-auto d-flex flex-items-center">
          <div class="mr-2">Pool {{ _shorten(pool.id) }}</div>
          <UiLabel v-if="!pool.finalized" v-text="'Private'" />
        </h3>
        <div class="d-flex">
          <UiButton
            class="ml-2"
            @click="openAddLiquidityModal"
            v-if="enableAddLiquidity"
          >
            Add Liquidity
          </UiButton>
          <UiButton
            v-if="hasShares"
            class="button-outline ml-2"
            @click="openRemoveLiquidityModal"
          >
            Remove Liquidity
          </UiButton>
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
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false
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
    ...mapActions(['getPool', 'getBalances']),
    openAddLiquidityModal() {
      if (!this.hasProxy) {
        return this.$router.push({ name: 'setup' });
      }
      this.modalAddLiquidityOpen = true;
    },
    openRemoveLiquidityModal() {
      this.modalRemoveLiquidityOpen = true;
    }
  },
  async created() {
    if (Object.keys(this.pool).length === 0) {
      this.loading = true;
      this.pool = await this.getPool(this.id);
      if (this.web3.account) {
        this.getBalances(this.pool.tokensList);
      }
      this.loading = false;
    }
  }
};
</script>
