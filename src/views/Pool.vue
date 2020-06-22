<template>
  <div>
    <VueLoadingIndicator v-if="loading" class="big" />
    <div v-else>
      <h3 class="flex-auto mb-4">Pool {{ pool.id | shorten }}</h3>

      <div
        class="border rounded-lg-2 mb-4 pt-3 position-relative panel-background"
      >
        <div class="position-absolute top-4 left-0 right-0" style="z-index: 9;">
          <div class="d-flex px-4">
            <div class="d-flex">
              <Button class="ml-2" @click="modalAddLiquidityOpen = true">
                Add liquidity
              </Button>
              <Button
                v-if="hasShares"
                class="ml-2"
                @click="modalRemoveLiquidityOpen = true"
              >
                Remove liquidity
              </Button>
            </div>
          </div>
        </div>
        <div style="min-height: 300px;" v-if="pool.id">
          <Chart :pool="pool" />
        </div>
      </div>
      <div class="overflow-hidden mb-4 ml-n2 mr-n2 text-center">
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2"><Price :amount="pool.totalEthValue" /></h2>
            <h4>Liquidity</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2"><Price :amount="pool.totalVolume1Day" /></h2>
            <h4>Trade vol. (24hr)</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2">{{ $n(pool.swapFeePercent) }}%</h2>
            <h4>Pool swap fee</h4>
          </div>
        </div>
        <div class="col-3 float-left">
          <div class="border panel-background rounded-1 p-4 mx-2">
            <h2 class="mb-2">0%</h2>
            <h4>My pool share</h4>
          </div>
        </div>
      </div>
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
      return this.pool.shares.reduce(
        (a, b) => (a === true ? true : b.userAddress.id === this.web3.account),
        false
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
