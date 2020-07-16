<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Add Liquidity</h3>
      </template>
      <SingleMultiToggle :selected="type" :onSelect="onTypeSelect" />
      <div class="m-4 d-flex flex-justify-between">
        <PoolOverview :pool="pool" :userShare="userShare" style="width: 32%" />
        <UiTable>
          <UiTableTh>
            <div class="column-lg flex-auto text-left">Asset</div>
            <div class="column text-left">Wallet Balance</div>
            <div class="column-sm">Deposit Amount</div>
          </UiTableTh>
          <UiTableTr v-for="token in pool.tokens" :key="token.address">
            <div
              class="column-lg flex-auto d-flex flex-items-center text-left d-flex"
            >
              <UiRadio
                class="mr-1"
                v-if="!isMultiAsset"
                :checked="activeToken === token.address"
                :onChange="
                  e => {
                    onTokenSelect(token.address);
                  }
                "
              />
              <Token :address="token.address" class="mr-2" size="20" />
              <div class="text-white">{{ token.symbol }}</div>
              <ButtonUnlock class="ml-2" :tokenAddress="token.address" />
            </div>
            <div class="column text-left">
              {{
                _trunc(
                  formatBalance(
                    web3.balances[token.checksum] || '0',
                    token.decimals
                  ),
                  2
                )
              }}
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
                  v-if="isMultiAsset || activeToken === token.address"
                  class="input flex-auto text-right"
                  :class="
                    isSufficientBalance(token) ? 'text-white' : 'text-red'
                  "
                  placeholder="0.0"
                  @input="handleChange(amounts[token.address], token)"
                />
              </div>
            </div>
          </UiTableTr>
        </UiTable>
      </div>
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
  normalizeBalance,
  denormalizeBalance
} from '@/helpers/utils';
import { calcPoolOutGivenSingleIn } from '@/helpers/math';
import { LiquidityType } from '@/components/SingleMultiToggle';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      poolTokens: null,
      amounts: {},
      type: LiquidityType.MULTI_ASSET,
      activeToken: null
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
      this.type = LiquidityType.MULTI_ASSET;
      this.activeToken = this.pool.tokens[0].address;
    }
  },
  computed: {
    userShare() {
      const poolSharesFrom = this.subgraph.poolShares[this.pool.id] || 0;
      const totalShares = parseFloat(this.pool.totalShares);
      const current = poolSharesFrom / totalShares;
      if (!this.isValid) {
        return {
          current
        };
      }

      const poolTokens = this.poolTokens
        ? bnum(this.poolTokens)
            .div('1e18')
            .toNumber()
        : 0;
      const future = (poolSharesFrom + poolTokens) / (totalShares + poolTokens);
      const userShare = {
        current,
        future
      };
      return userShare;
    },
    isValid() {
      let isValid = true;
      this.pool.tokens.forEach(token => {
        if (!this.isMultiAsset && token.address !== this.activeToken) {
          return;
        }
        const allowance = this.web3.proxyAllowances[token.address] || 0;
        if (
          this.loading ||
          !this.amounts[token.address] ||
          !this.isSufficientBalance(token) ||
          allowance <= 0
        )
          isValid = false;
      });
      return isValid;
    },
    isMultiAsset() {
      return this.type === LiquidityType.MULTI_ASSET;
    }
  },
  methods: {
    ...mapActions(['joinPool', 'joinswapExternAmountIn']),
    handleChange(changedAmount, changedToken) {
      const ratio = bnum(changedAmount).div(changedToken.balance);
      if (this.isMultiAsset) {
        this.poolTokens = calcPoolTokensByRatio(ratio, this.pool.totalShares);
      } else {
        const tokenIn = this.pool.tokens.find(
          token => token.address === this.activeToken
        );
        const amount = new BigNumber(this.amounts[tokenIn.address]);

        const tokenBalanceIn = denormalizeBalance(
          tokenIn.balance,
          tokenIn.decimals
        );
        const tokenWeightIn = bnum(tokenIn.denormWeight).times('1e18');
        const poolSupply = denormalizeBalance(this.pool.totalShares, 18);
        const totalWeight = bnum(this.pool.totalWeight).times('1e18');
        const tokenAmountIn = denormalizeBalance(
          amount,
          tokenIn.decimals
        ).integerValue(BigNumber.ROUND_UP);
        const swapFee = bnum(this.pool.swapFee).times('1e18');

        this.poolTokens = calcPoolOutGivenSingleIn(
          tokenBalanceIn,
          tokenWeightIn,
          poolSupply,
          totalWeight,
          tokenAmountIn,
          swapFee
        ).toString();
      }

      this.pool.tokens.forEach(token => {
        if (!this.isMultiAsset) {
          return;
        }
        if (token.address === changedToken.address) {
          return;
        }
        this.amounts[token.address] = ratio.times(token.balance);
      });
    },
    handleMax(token) {
      const balance = this.web3.balances[token.checksum];
      const amount = normalizeBalance(balance, token.decimals);
      this.amounts[token.address] = amount;
      this.handleChange(amount, token);
    },
    onTypeSelect(type) {
      this.type = type;
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.address, ''];
        })
      );
    },
    onTokenSelect(token) {
      this.activeToken = token;
    },
    async handleSubmit() {
      this.loading = true;
      if (this.isMultiAsset) {
        const params = {
          poolAddress: this.pool.id,
          poolAmountOut: this.poolTokens,
          maxAmountsIn: this.pool.tokensList.map(tokenAddress => {
            const token = this.pool.tokens.find(
              token => token.checksum === tokenAddress
            );
            const amount = bnum(this.amounts[token.address]);
            return denormalizeBalance(amount, token.decimals)
              .integerValue(BigNumber.ROUND_UP)
              .toString();
          })
        };
        await this.joinPool(params);
      } else {
        const tokenIn = this.pool.tokens.find(
          token => token.address === this.activeToken
        );
        const tokenAmountIn = denormalizeBalance(
          this.amounts[tokenIn.address],
          tokenIn.decimals
        )
          .integerValue(BigNumber.ROUND_UP)
          .toString();
        const params = {
          poolAddress: this.pool.id,
          tokenInAddress: this.activeToken,
          tokenAmountIn,
          minPoolAmountOut: '0'
        };
        await this.joinswapExternAmountIn(params);
      }
      this.loading = false;
    },
    isSufficientBalance(token) {
      const amount = this.amounts[token.address] || 0;
      const amountNumber = denormalizeBalance(amount, token.decimals);
      const balance = this.web3.balances[token.checksum];
      return amountNumber.lte(balance);
    },
    formatBalance(balanceString, tokenDecimals) {
      return normalizeBalance(balanceString, tokenDecimals);
    }
  }
};
</script>
