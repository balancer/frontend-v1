<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Remove liquidity</h3>
      </template>
      <div class="px-4 pt-4">
        <PoolOverview :pool="pool" class="mb-4" />
        <UiTable class="mb-4">
          <UiTableTh>
            <div class="flex-auto text-left">Asset</div>
            <div class="column-sm">My pool balance</div>
            <div class="column-sm">Withdraw</div>
          </UiTableTh>
          <UiTableTr v-for="token in tokens" :key="token.address">
            <div class="flex-auto flex-items-center d-flex text-left">
              <Token :address="token.address" class="mr-3" size="20" />
              <div class="text-white">{{ token.symbol }}</div>
            </div>
            <div class="text-white column">
              {{ $n(token.myBalance.toFixed(3)) }}
              {{ token.symbol }}
            </div>
            <div class="text-white column">
              {{ $n((token.balance / pool.totalShares) * poolAmountIn) }}
              {{ token.symbol }}
            </div>
          </UiTableTr>
        </UiTable>
        <UiTable class="mb-4">
          <UiTableTh class="text-left flex-items-center text-white">
            <div class="flex-auto">BPT amount</div>
            <div class="ml-2">
              {{ $n(poolTokenBalance) }} BPT
              <a @click="setMax" class="link-text mr-3">
                <UiLabel v-text="'Max'" />
              </a>
            </div>
            <input
              id="poolAmountIn"
              v-model="poolAmountIn"
              :class="!poolAmountIn || isValid ? 'text-white' : 'text-red'"
              class="input text-right column-sm"
              type="number"
              step="any"
              placeholder="0.0"
            />
          </UiTableTh>
        </UiTable>
      </div>
      <template slot="footer">
        <UiButton
          :disabled="!isValid || loading"
          type="submit"
          class="ml-2"
          :loading="loading"
        >
          Remove liquidity
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      poolAmountIn: ''
    };
  },
  watch: {
    open() {
      this.poolAmountIn = '';
      this.loading = false;
    }
  },
  computed: {
    poolTokenBalance() {
      return this.subgraph.poolShares[this.pool.id] || 0;
    },
    tokens() {
      return this.pool.tokens.map(token => {
        token.myBalance = this.getTokenBalance(token);
        return token;
      });
    },
    isValid() {
      return this.poolTokenBalance >= parseFloat(this.poolAmountIn);
    }
  },
  methods: {
    ...mapActions(['exitPool']),
    async handleSubmit() {
      this.loading = true;
      await this.exitPool({
        poolAddress: this.pool.id,
        poolAmountIn: this.poolAmountIn,
        minAmountsOut: this.pool.tokens.map(() => 0) // @TODO add amounts
      });
      this.loading = false;
    },
    getTokenBalance(token) {
      if (!this.poolTokenBalance) return 0;
      return (this.poolTokenBalance / this.pool.totalShares) * token.balance;
    },
    setMax() {
      this.poolAmountIn = this.poolTokenBalance.toString();
    }
  }
};
</script>
