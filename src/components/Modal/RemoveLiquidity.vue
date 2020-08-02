<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Remove Liquidity</h3>
      </template>
      <div class="text-center m-4 mt-0">
        <SingleMultiToggle
          action="remove"
          :selected="type"
          @select="handleSelectType"
        />
      </div>
      <div class="m-4 d-flex flex-justify-between">
        <PoolOverview :pool="pool" :userShare="userShare" style="width: 32%" />
        <div>
          <UiTable>
            <UiTableTh>
              <div class="column-lg flex-auto text-left">Asset</div>
              <div class="column">My Pool Balance</div>
              <div class="column-sm">Withdraw</div>
            </UiTableTh>
            <UiTableTr
              v-for="token in tokens"
              :key="token.address"
              class="text-white"
            >
              <div
                class="column-lg flex-auto flex-items-center d-flex text-left"
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
                <Token :address="token.address" class="mr-3" size="20" />
                <div class="text-white">{{ _ticker(token.checksum) }}</div>
              </div>
              <div class="column">
                {{ $n(token.myBalance.toFixed(3)) }}
              </div>
              <div class="column-sm">
                {{ $n(getTokenAmountOut(token)) }}
              </div>
            </UiTableTr>
          </UiTable>
          <UiTable class="mt-4">
            <UiTableTh class="text-left flex-items-center text-white">
              <div class="flex-auto">BPT amount</div>
              <div class="ml-2 column text-left">
                {{ $n(poolTokenBalance) }} BPT
                <a @click="setMax" class="link-text mr-3">
                  <UiLabel v-text="'Max'" />
                </a>
              </div>
              <input
                id="poolAmountIn"
                v-model="poolAmountIn"
                :class="validationError ? 'text-red' : 'text-white'"
                class="input text-right column-sm"
                placeholder="0.0"
              />
            </UiTableTh>
          </UiTable>
        </div>
      </div>
      <template slot="footer">
        <MessageError
          v-if="validationError"
          :text="validationError"
          class="mb-4"
        />
        <MessageWarning
          v-if="slippageWarning"
          :text="slippageWarning"
          class="mb-4"
        />
        <UiButton
          :disabled="validationError || loading"
          type="submit"
          class="button-primary ml-2"
          :loading="loading"
        >
          Remove Liquidity
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { bnum, normalizeBalance, denormalizeBalance } from '@/helpers/utils';
import { calcSingleOutGivenPoolIn } from '@/helpers/math';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      poolAmountIn: '',
      type: 'MULTI_ASSET',
      activeToken: null
    };
  },
  watch: {
    open() {
      this.poolAmountIn = '';
      this.loading = false;
      this.type = 'MULTI_ASSET';
      this.activeToken = this.pool.tokens[0].address;
    }
  },
  computed: {
    poolTokenBalance() {
      return this.subgraph.poolShares[this.pool.id] || 0;
    },
    userShare() {
      const poolSharesFrom = this.subgraph.poolShares[this.pool.id] || 0;
      const totalShares = parseFloat(this.pool.totalShares);
      const current = poolSharesFrom / totalShares;
      if (this.validationError) {
        return {
          current
        };
      }

      const poolTokens = parseFloat(this.poolAmountIn);
      const future = (poolSharesFrom - poolTokens) / (totalShares - poolTokens);
      const userShare = {
        current,
        future
      };
      return userShare;
    },
    tokens() {
      return this.pool.tokens.map(token => {
        token.myBalance = this.getTokenBalance(token);
        return token;
      });
    },
    validationError() {
      this.poolTokenBalance >= parseFloat(this.poolAmountIn);
      // Basic input validation
      if (!this.poolAmountIn) {
        return `Value can't be empty`;
      }
      if (isNaN(this.poolAmountIn)) {
        return 'Values should be numbers';
      }
      if (parseFloat(this.poolAmountIn) <= 0) {
        return 'Value should be a positive number';
      }
      // Amount validation
      const amount = bnum(this.poolAmountIn);
      if (amount.gt(this.poolTokenBalance)) {
        return 'Token amount should not exceed balance';
      }
      // Max ratio out validation
      if (!this.isMultiAsset) {
        const tokenOutAddress = this.activeToken;
        const tokenOut = this.pool.tokens.find(
          token => token.address === tokenOutAddress
        );

        const maxOutRatio = 1 / 3;
        const amount = denormalizeBalance(this.poolAmountIn, 18);

        const tokenBalanceOut = denormalizeBalance(
          tokenOut.balance,
          tokenOut.decimals
        );
        const tokenWeightOut = bnum(tokenOut.denormWeight).times('1e18');
        const poolSupply = denormalizeBalance(this.pool.totalShares, 18);
        const totalWeight = bnum(this.pool.totalWeight).times('1e18');
        const swapFee = bnum(this.pool.swapFee).times('1e18');

        if (amount.div(poolSupply).gt(0.99)) {
          // Invalidate user's attempt to withdraw the entire pool supply in a single token
          // At amounts close to 100%, solidity math freaks out
          return 'Insufficient pool liquidity';
        }

        const tokenAmountOut = calcSingleOutGivenPoolIn(
          tokenBalanceOut,
          tokenWeightOut,
          poolSupply,
          totalWeight,
          amount,
          swapFee
        );
        if (tokenAmountOut.div(tokenBalanceOut).gt(maxOutRatio)) {
          return 'Insufficient pool liquidity';
        }
      }
      return undefined;
    },
    slippageWarning() {
      if (this.validationError) {
        return undefined;
      }
      if (this.isMultiAsset) {
        return undefined;
      }
      const slippageThreshold = 0.01;
      const tokenOutAddress = this.activeToken;
      const tokenOut = this.pool.tokens.find(
        token => token.address === tokenOutAddress
      );
      const amount = bnum(this.poolAmountIn).times('1e18');

      const tokenBalanceOut = denormalizeBalance(
        tokenOut.balance,
        tokenOut.decimals
      );
      const tokenWeightOut = bnum(tokenOut.denormWeight).times('1e18');
      const poolSupply = denormalizeBalance(this.pool.totalShares, 18);
      const totalWeight = bnum(this.pool.totalWeight).times('1e18');
      const swapFee = bnum(this.pool.swapFee).times('1e18');

      const tokenAmountOut = calcSingleOutGivenPoolIn(
        tokenBalanceOut,
        tokenWeightOut,
        poolSupply,
        totalWeight,
        amount,
        swapFee
      );
      const expectedTokenAmountOut = amount
        .times(totalWeight)
        .times(tokenBalanceOut)
        .div(poolSupply)
        .div(tokenWeightOut);
      const one = bnum(1);
      const slippage = one.minus(tokenAmountOut.div(expectedTokenAmountOut));

      if (slippage.gte(slippageThreshold)) {
        const slippageString = slippage.times(100).toFixed(2);
        return `Removing liquidity will incur ${slippageString}% of slippage`;
      }
      return undefined;
    },
    isMultiAsset() {
      return this.type === 'MULTI_ASSET';
    }
  },
  methods: {
    ...mapActions(['exitPool', 'exitswapPoolAmountIn']),
    async handleSubmit() {
      this.loading = true;
      if (this.isMultiAsset) {
        await this.exitPool({
          poolAddress: this.pool.id,
          poolAmountIn: this.poolAmountIn,
          minAmountsOut: this.pool.tokens.map(() => 0) // @TODO add amounts
        });
      } else {
        const tokenOutAddress = this.activeToken;
        await this.exitswapPoolAmountIn({
          poolAddress: this.pool.id,
          tokenOutAddress,
          poolAmountIn: this.poolAmountIn,
          minTokenAmountOut: '0'
        });
      }
      this.loading = false;
    },
    handleSelectType(type) {
      this.type = type;
    },
    onTokenSelect(token) {
      this.activeToken = token;
    },
    getTokenBalance(token) {
      if (!this.poolTokenBalance) return 0;
      return (this.poolTokenBalance / this.pool.totalShares) * token.balance;
    },
    getTokenAmountOut(token) {
      if (this.validationError) {
        return 0;
      }
      if (this.isMultiAsset) {
        return (token.balance / this.pool.totalShares) * this.poolAmountIn;
      } else {
        if (this.activeToken !== token.address) {
          return 0;
        }
        const tokenOut = this.pool.tokens.find(
          token => token.address === this.activeToken
        );
        const amount = denormalizeBalance(this.poolAmountIn, 18);

        const tokenBalanceOut = denormalizeBalance(
          tokenOut.balance,
          tokenOut.decimals
        );
        const tokenWeightOut = bnum(tokenOut.denormWeight).times('1e18');
        const poolSupply = denormalizeBalance(this.pool.totalShares, 18);
        const totalWeight = bnum(this.pool.totalWeight).times('1e18');
        const swapFee = bnum(this.pool.swapFee).times('1e18');

        const tokenAmountOut = calcSingleOutGivenPoolIn(
          tokenBalanceOut,
          tokenWeightOut,
          poolSupply,
          totalWeight,
          amount,
          swapFee
        );
        const tokenAmountNormalized = normalizeBalance(
          tokenAmountOut,
          tokenOut.decimals
        );
        return tokenAmountNormalized.toNumber();
      }
    },
    setMax() {
      this.poolAmountIn = this.poolTokenBalance.toString();
    }
  }
};
</script>
