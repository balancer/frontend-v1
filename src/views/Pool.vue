<template>
  <div class="px-0 px-md-5 py-4">
    <VueLoadingIndicator v-if="loading" class="big" />
    <div
      v-else-if="!pool"
      class="text-white text-center mt-8"
      style="font-size: 24px;"
    >
      Pool not found
    </div>
    <div v-else>
      <MessageWarning
        v-if="customTokenWarning"
        :text="customTokenWarning"
        class="mb-4"
      />
      <div class="d-flex flex-items-center flex-auto mb-4 px-4 px-md-0">
        <h3 class="flex-auto d-flex flex-items-center">
          <div>Pool {{ _shorten(pool.id) }}</div>
          <a :href="_etherscanLink(pool.id)" target="_blank" class="text-white">
            <Icon name="external-link" size="16" class="ml-1 mr-2" />
          </a>
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
      v-if="pool"
      :pool="pool"
      :open="modalAddLiquidityOpen"
      @close="modalAddLiquidityOpen = false"
    />
    <ModalRemoveLiquidity
      v-if="pool"
      :pool="pool"
      :open="modalRemoveLiquidityOpen"
      @close="modalRemoveLiquidityOpen = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import config from '@/helpers/config';

function getTokenAddressBySymbol(symbol) {
  const tokenAddresses = Object.keys(config.tokens);
  return tokenAddresses.find(
    tokenAddress => config.tokens[tokenAddress].symbol === symbol
  );
}

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
    customTokenWarning() {
      const ampl = '0xD46bA6D942050d489DBd938a2C909A5d5039A161';
      const yfi = getTokenAddressBySymbol('YFI');
      const warningMap = {
        [ampl]: `This is a risky pool. AMPL can change its balance inside the pool during rebase. That can lead to partial lose of pool's value. PLEASE SLOW DOWN AND DYOR.`,
        [yfi]:
          'This is a risky pool. If the YFI token is infinitely minted, a huge percent of the entire pool supply can be stolen. PLEASE SLOW DOWN AND DYOR.'
      };
      for (const token of this.pool.tokensList) {
        const warning = warningMap[token];
        if (warning) {
          return warning;
        }
      }
      return undefined;
    },
    hasScamToken() {
      for (const token of this.pool.tokensList) {
        if (config.scams.includes(token)) {
          return true;
        }
      }
      return false;
    },
    hasShares() {
      return Object.keys(this.subgraph.poolShares).includes(this.id);
    },
    enableAddLiquidity() {
      return (
        this.pool.finalized &&
        this.pool.totalShares !== '0' &&
        !this.hasScamToken
      );
    }
  },
  methods: {
    ...mapActions([
      'getPool',
      'getBalances',
      'getAllowances',
      'loadTokenMetadata',
      'loadPricesByAddress'
    ]),
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
      if (!this.pool) {
        this.loading = false;
        return;
      }
      const unknownTokens = this.pool.tokensList.filter(
        tokenAddress => !this.web3.tokenMetadata[tokenAddress]
      );
      if (unknownTokens.length > 0) {
        await this.loadTokenMetadata(unknownTokens);
        await this.loadPricesByAddress(unknownTokens);
      }
      if (this.web3.account) {
        await Promise.all([
          this.getBalances(this.pool.tokensList),
          this.getAllowances({
            tokens: this.pool.tokensList,
            spender: this.web3.dsProxyAddress
          })
        ]);
      }
      this.loading = false;
    }
  }
};
</script>
