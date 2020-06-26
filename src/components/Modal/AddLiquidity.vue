<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body" v-if="pool.id">
      <h4 class="p-4 border-bottom text-white">Add liquidity</h4>
      <form @submit.prevent="handleSubmit" class="flex-auto p-4">
        <div class="d-flex mb-4">
          <PoolOverview :pool="pool" class="col-3" />
          <div class="border rounded-1 flex-auto ml-4">
            <div>
              <div
                class="d-flex flex-items-center text-right px-4 py-3 border-bottom"
              >
                <div class="column-sm text-left">Asset</div>
                <div class="flex-auto text-left">Unlock</div>
                <div class="column-sm text-left">Wallet balance</div>
                <div class="column">Deposit amount</div>
              </div>
              <div
                v-for="token in pool.tokens"
                :key="token.address"
                class="d-flex px-4 py-3 text-right text-white flex-items-center"
              >
                <div class="column-sm text-left d-flex">
                  <Token :address="token.address" class="mr-3" size="20" />
                  <div class="text-white">{{ token.symbol }}</div>
                </div>
                <div class="flex-auto text-left">
                  <ButtonUnlock
                    :tokenAddress="token.address"
                    :spender="poolAddress"
                  />
                </div>
                <div class="column-sm text-left">
                  {{ web3.balances[token.checksum] | trunc(2) }}
                  {{ token.symbol }}
                </div>
                <div class="column">
                  <div
                    class="rounded-1 border flex-auto ml-3 py-1 text-left d-flex flex-items-center"
                  >
                    <a @click="handleMax(token)" class="link-text mx-2">
                      Max
                    </a>
                    <input
                      v-model="amounts[token.address]"
                      type="number"
                      step="any"
                      class="input flex-auto text-right column-sm px-2"
                      :class="
                        web3.balances[token.checksum] >=
                        parseFloat(amounts[token.address])
                          ? 'text-white'
                          : 'text-red'
                      "
                      placeholder="0.0"
                      @input="handleChange(amounts[token.address], token)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center">
          <Button :disabled="!isValid || loading" type="submit" class="ml-2">
            <VueLoadingIndicator v-if="loading" />
            <span v-else>Add liquidity</span>
          </Button>
        </div>
      </form>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { trunc, denormalizeBalance, bnum } from '@/helpers/utils';
import BigNumber from '@/helpers/bignumber';
import { calcPoolTokensByRatio } from '@/helpers/utils';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      poolTokens: null,
      amounts: {}
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.address, ''];
        })
      );
    }
  },
  computed: {
    poolAddress() {
      return this.pool.id;
    },
    isValid() {
      let isValid = true;
      this.pool.tokens.forEach(token => {
        if (
          !this.amounts[token.address] ||
          this.web3.balances[token.checksum] < this.amounts[token.address]
        )
          isValid = false;
      });
      return isValid;
    }
  },
  methods: {
    ...mapActions(['joinPool']),
    handleChange(changedAmount, changedToken) {
      if (!parseFloat(changedAmount)) return;

      // @TODO - fix calcs so no buffer is needed
      const ratio = changedAmount / changedToken.balance;
      this.poolTokens = calcPoolTokensByRatio(ratio, this.pool.totalShares);
      this.pool.tokens.forEach(token => {
        if (token.address !== changedToken) {
          this.amounts[token.address] = trunc(ratio * token.balance, 8);
        }
      });
    },
    handleMax(token) {
      const amount = trunc(this.web3.balances[token.checksum], 8);
      this.amounts[token.address] = amount;
      this.handleChange(amount, token);
    },
    async handleSubmit() {
      this.loading = true;

      await this.joinPool({
        poolAddress: this.poolAddress,
        poolAmountOut: this.poolTokens,
        maxAmountsIn: this.pool.tokensList.map(token => {
          const amount = bnum(this.amounts[token.toLowerCase()]);
          return denormalizeBalance(amount, token)
            .integerValue(BigNumber.ROUND_DOWN)
            .toString();
        })
      });

      this.loading = false;
    }
  }
};
</script>
