<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body" v-if="pool.id">
      <h4 class="p-4 border-bottom text-white">Remove liquidity</h4>
      <form @submit.prevent="handleSubmit" class="flex-auto p-4">
        <div class="d-flex mb-4">
          <PoolOverview :pool="pool" class="col-3" />
          <div class="border rounded-1 flex-auto ml-4">
            <div>
              <div
                class="d-flex border-bottom flex-items-center text-right p-3"
              >
                <div class="flex-auto text-left">Asset</div>
                <div class="column-sm">My pool balance</div>
                <div class="column-sm">Withdraw amount</div>
              </div>
              <div
                v-for="token in tokens"
                :key="token.address"
                class="d-flex p-3 text-right"
              >
                <div class="flex-auto flex-items-center d-flex text-left">
                  <Token :address="token.address" class="mr-3" size="20" />
                  <div class="text-white">{{ token.symbol }}</div>
                </div>
                <div class="text-white column-sm">
                  {{ $n(token.myBalance.toFixed(3)) }}
                  {{ token.symbol }}
                </div>
                <div class="text-white column-sm">
                  {{ $n((token.balance / pool.totalShares) * poolAmountIn) }}
                  {{ token.symbol }}
                </div>
              </div>
            </div>
            <div class="p-3 text-right">
              <div class="mb-2">Amount</div>
              <div
                class="rounded-1 border text-right py-1 column px-2 d-inline-block mb-2"
              >
                <span class="d-flex flex-auto text-right">
                  <input
                    id="poolAmountIn"
                    v-model="poolAmountIn"
                    :class="
                      !poolAmountIn || isValid ? 'text-white' : 'text-red'
                    "
                    class="input text-right flex-auto"
                    type="number"
                    step="any"
                    placeholder="0.0"
                  />
                  <div
                    class="h4 ml-2"
                    :class="
                      !poolAmountIn || isValid ? 'text-white' : 'text-red'
                    "
                  >
                    BPT
                  </div>
                </span>
              </div>
              <div>
                <a @click="poolAmountIn = poolTokenBalance" class="link-text">
                  Max: {{ $n(poolTokenBalance) }}
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <UiButton :disabled="!isValid || loading" type="submit" class="ml-2">
            <VueLoadingIndicator v-if="loading" />
            <span v-else>Remove liquidity</span>
          </UiButton>
        </div>
      </form>
    </div>
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
        minAmountsOut: this.pool.tokens.map(() => 0)
      });
      this.loading = false;
    },
    getTokenBalance(token) {
      if (!this.poolTokenBalance) return 0;
      return (this.poolTokenBalance / this.pool.totalShares) * token.balance;
    }
  }
};
</script>
