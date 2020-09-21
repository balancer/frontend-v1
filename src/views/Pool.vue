<template>
  <div class="px-0 px-md-5 pt-4">
    <div v-if="loading" class="text-center">
      <UiLoading class="big" />
    </div>
    <div v-else>
      <MessageSimilarPools
        v-if="pool.liquidity < 1e7 && pool.finalized"
        :pool="pool"
        class="mb-4"
      />
      <div class="d-flex flex-items-center flex-auto mb-4 px-4 px-md-0">
        <PoolHeader :pool="bPool" class="flex-auto" />
        <div class="d-flex">
          <UiButton
            v-if="enableAddLiquidity"
            class="button-primary ml-2"
            @click="openAddLiquidityModal"
          >
            Add liquidity
          </UiButton>
          <UiButton
            v-if="enableAddLiquidity"
            class="ml-2"
            @click="openRemoveLiquidityModal"
          >
            Remove liquidity
          </UiButton>
        </div>
      </div>
      <PoolBoxes :pool="pool" />
      <Chart :pool="pool" />
      <Tabs :pool="pool" />
      <router-view :key="$route.path" :pool="pool" :bPool="bPool" />
    </div>
    <ModalAddLiquidity
      :pool="pool"
      :bPool="bPool"
      :open="modalAddLiquidityOpen"
      @close="modalAddLiquidityOpen = false"
    />
    <ModalRemoveLiquidity
      :pool="pool"
      :bPool="bPool"
      :open="modalRemoveLiquidityOpen"
      @close="modalRemoveLiquidityOpen = false"
    />
    <ModalCustomToken
      v-if="hasCustomToken"
      :open="modalCustomTokenOpen"
      @close="modalCustomTokenOpen = false"
    />
  </div>
</template>

<script>
import { getAddress } from '@ethersproject/address';

import { mapActions } from 'vuex';
import Pool from '@/_balancer/pool';

export default {
  data() {
    return {
      bPool: undefined,
      id: this.$route.params.id,
      pool: {},
      loading: false,
      modalAddLiquidityOpen: false,
      modalRemoveLiquidityOpen: false,
      modalCustomTokenOpen: true
    };
  },
  watch: {
    $route() {
      const id = this.$route.params.id;
      if (id !== this.id) {
        this.id = id;
        this.loadPool();
      }
    }
  },
  computed: {
    hasCustomToken() {
      if (!this.pool || !this.pool.tokens) {
        return false;
      }
      for (const token of this.pool.tokens) {
        const tokenMetadata = this.web3.tokenMetadata[token.checksum];
        if (!tokenMetadata || !tokenMetadata.whitelisted) {
          return true;
        }
      }
      return false;
    },
    enableAddLiquidity() {
      return (
        this.config.chainId === this.web3.injectedChainId &&
        this.web3.account &&
        (this.pool.finalized || this.pool.crp)
      );
    },
    enableRemoveLiquidity() {
      return (
        this.config.chainId === this.web3.injectedChainId &&
        this.web3.account &&
        (Object.keys(this.subgraph.poolShares).includes(this.id) ||
          this.web3.balances[getAddress(this.id)])
      );
    }
  },
  methods: {
    ...mapActions([
      'getBalances',
      'getAllowances',
      'loadTokenMetadata',
      'loadPricesByAddress'
    ]),
    openAddLiquidityModal() {
      if (!this.web3.dsProxyAddress) {
        return this.$router.push({ name: 'setup' });
      }
      this.modalAddLiquidityOpen = true;
    },
    openRemoveLiquidityModal() {
      this.modalRemoveLiquidityOpen = true;
    },
    async loadPool() {
      this.loading = true;
      this.bPool = new Pool(this.id);
      try {
        this.pool = await this.bPool.getMetadata();
      } catch (e) {
        return this.$router.push({ name: 'home' });
      }
      */
      const unknownTokens = this.pool.tokensList.filter(
        tokenAddress => !this.web3.tokenMetadata[tokenAddress]
      );
      if (unknownTokens.length > 0) {
        await this.loadTokenMetadata(unknownTokens);
        await this.loadPricesByAddress(unknownTokens);
      }
      if (this.$auth.isAuthenticated) {
        await Promise.all([
          this.getBalances([
            ...this.pool.tokensList,
            getAddress(this.bPool.getBptAddress())
          ]),
          this.getAllowances({
            tokens: this.pool.tokensList,
            spender: this.web3.dsProxyAddress
          })
        ]);
      }
      this.loading = false;
    }
  },
  created() {
    this.loadPool();
  }
};
</script>
