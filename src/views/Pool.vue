<template>
  <Page :loading="loading">
    <Container>
      <MessageSimilarPools
        v-if="pool.liquidity < 1e7 && pool.finalized"
        :pool="pool"
        class="mb-4"
      />
      <div class="d-block text-center text-md-left d-md-flex mb-3 mb-md-0">
        <PoolHeader :pool="bPool" class="flex-auto pb-3" />
        <div class="pb-3">
          <UiButton
            v-if="enableAddLiquidity && pool.tokens.length > 0"
            class="button-primary ml-2"
            @click="openAddLiquidityModal"
          >
            {{ $t('addLiquidity') }}
          </UiButton>
          <UiButton
            v-if="enableAddLiquidity && pool.tokens.length > 0"
            class="ml-2"
            @click="openRemoveLiquidityModal"
          >
            {{ $t('removeLiquidity') }}
          </UiButton>
        </div>
      </div>
      <PoolBoxes :pool="pool" :bPool="bPool" />
      <Chart :pool="pool" />
      <Tabs :pool="pool" />
      <router-view
        :key="$route.path"
        :pool="pool"
        :bPool="bPool"
        @reload="loadPool"
      />
    </Container>
    <portal to="modal">
      <ModalAddLiquidity
        :pool="pool"
        :bPool="bPool"
        :open="modalAddLiquidityOpen"
        @close="modalAddLiquidityOpen = false"
        @reload="loadPool"
      />
      <ModalRemoveLiquidity
        :pool="pool"
        :bPool="bPool"
        :open="modalRemoveLiquidityOpen"
        @close="modalRemoveLiquidityOpen = false"
        @reload="loadPool"
      />
      <ModalCustomToken
        v-if="hasCustomToken && !bPool.isWhitelisted()"
        :open="modalCustomTokenOpen"
        @close="modalCustomTokenOpen = false"
      />
    </portal>
  </Page>
</template>

<script>
import Vue from 'vue';
import { mapActions } from 'vuex';
import { getAddress } from '@ethersproject/address';
import Pool from '@/_balancer/pool';
import { bnum, scale } from '@/helpers/utils';

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
    },
    'web3.account': async function(val, prev) {
      if (val && val.toLowerCase() !== prev) await this.loadPool();
    }
  },
  computed: {
    hasCustomToken() {
      if (!this.pool || !this.pool.tokens) return false;
      for (const token of this.pool.tokens) {
        const tokenMetadata = this.web3.tokenMetadata[token.checksum];
        if (!tokenMetadata || !tokenMetadata.whitelisted) return true;
      }
      return false;
    },
    enableAddLiquidity() {
      if (!this.bPool) return false;
      return this.pool.finalized || this.bPool.isCrp();
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
      'getPoolBalances',
      'loadTokenMetadata',
      'loadPricesByAddress'
    ]),
    openAddLiquidityModal() {
      this.modalAddLiquidityOpen = true;
    },
    openRemoveLiquidityModal() {
      this.modalRemoveLiquidityOpen = true;
    },
    async loadPool() {
      const bPool = new Pool(this.id);
      try {
        this.pool = await bPool.getMetadata();
        this.bPool = bPool;
      } catch (e) {
        return this.$router.push({ name: 'home' });
      }
      const unknownTokens = this.pool.tokensList.filter(
        tokenAddress => !this.web3.tokenMetadata[tokenAddress]
      );
      if (unknownTokens.length > 0) {
        await this.loadTokenMetadata(unknownTokens);
        await this.loadPricesByAddress(unknownTokens);
      }
      if (this.$auth.isAuthenticated && !this.ui.authLoading) {
        const data = await Promise.all([
          this.getBalances([
            ...this.pool.tokensList,
            getAddress(this.bPool.getBptAddress())
          ]),
          this.getAllowances(this.pool.tokensList),
          this.getPoolBalances({
            poolAddress: this.id,
            tokens: this.pool.tokensList
          })
        ]);
        this.fixPoolBalances(data[2]);
      }
    },
    fixPoolBalances(poolBalances) {
      for (const address in poolBalances) {
        const tokenIndex = this.pool.tokens.findIndex(
          token => token.checksum === address
        );
        const tokenDecimals = this.pool.tokens[tokenIndex].decimals;
        const poolBalance = scale(bnum(poolBalances[address]), -tokenDecimals);
        Vue.set(
          this.pool.tokens[tokenIndex],
          'balance',
          poolBalance.toString()
        );
      }
    }
  },
  async created() {
    this.loading = true;
    await this.loadPool();
    this.loading = false;
  }
};
</script>
