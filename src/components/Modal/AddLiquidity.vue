<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Add Liquidity</h3>
      </template>
      <div class="px-4 pt-4">
        <UiTable class="mb-4">
          <UiTableTh>
            <div class="flex-auto text-left">Asset</div>
            <div class="column text-left">Wallet Balance</div>
            <div class="column-sm">Deposit Amount</div>
          </UiTableTh>
          <UiTableTr v-for="token in pool.tokens" :key="token.address">
            <div class="flex-auto d-flex flex-items-center text-left d-flex">
              <Token :address="token.address" class="mr-2" size="20" />
              <div class="text-white">{{ token.symbol }}</div>
              <ButtonUnlock class="ml-2" :tokenAddress="token.address" />
            </div>
            <div class="column text-left">
              {{ _trunc(web3.balances[token.checksum] || 0, 2) }}
              {{ token.symbol }}
              <a @click="handleMax(token)" class="ml-1">
                <UiLabel v-text="'Max'" />
              </a>
            </div>
            <div class="column-sm">
              <div
                class="flex-auto ml-3 text-left d-flex flex-items-center position-relative"
              >
                <input
                  v-model="amounts[token.address]"
                  type="number"
                  step="any"
                  class="input flex-auto text-right"
                  :class="
                    web3.balances[token.checksum] >=
                    parseFloat(amounts[token.address])
                      ? 'text-white'
                      : 'text-red'
                  "
                  min="0"
                  placeholder="0.0"
                  @input="handleChange(amounts[token.address], token)"
                />
              </div>
            </div>
          </UiTableTr>
        </UiTable>
      </div>
      <MyPoolShares :pool="pool" :poolTokens="poolTokens" class="mb-4 mx-4" />
      <template slot="footer">
        <UiButton :disabled="!isValid" type="submit" :loading="loading">
          Add Liquidity
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import BigNumber from '@/helpers/bignumber';
import {
  calcPoolTokensByRatio,
  bnum,
  denormalizeBalance
} from '@/helpers/utils';

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
    isValid() {
      let isValid = true;
      this.pool.tokens.forEach(token => {
        const allowance = this.web3.proxyAllowances[token.address] || 0;
        if (
          this.loading ||
          !this.amounts[token.address] ||
          this.web3.balances[token.checksum] < this.amounts[token.address] ||
          allowance <= 0
        )
          isValid = false;
      });
      return isValid;
    }
  },
  methods: {
    ...mapActions(['joinPool']),
    handleChange(changedAmount, changedToken) {
      const ratio = bnum(changedAmount).div(changedToken.balance);
      this.poolTokens = calcPoolTokensByRatio(ratio, this.pool.totalShares);

      this.pool.tokens.forEach(token => {
        if (token.address !== changedToken.address) {
          this.amounts[token.address] = ratio.times(token.balance);
        }
      });
    },
    handleMax(token) {
      const amount = this.web3.balances[token.checksum];
      this.amounts[token.address] = amount;
      this.handleChange(amount, token);
    },
    async handleSubmit() {
      this.loading = true;
      const params = {
        poolAddress: this.pool.id,
        poolAmountOut: this.poolTokens,
        maxAmountsIn: this.pool.tokensList.map(token => {
          const amount = bnum(this.amounts[token.toLowerCase()]);
          return denormalizeBalance(amount, token)
            .integerValue(BigNumber.ROUND_DOWN)
            .toString();
        })
      };
      await this.joinPool(params);
      this.loading = false;
    }
  }
};
</script>
