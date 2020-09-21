<template>
  <UiModal :open="open" @close="$emit('close')" v-if="pool.id">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 class="text-white">Remove liquidity</h3>
      </template>
      <div class="text-center m-4 mt-0">
        <Toggle
          :value="type"
          :options="liquidityToggleOptions"
          @select="handleSelectType"
          class="mt-4"
        />
      </div>
      <div class="m-4 d-block d-sm-flex">
        <PoolOverview
          :pool="pool"
          :userShare="userLiquidity.relative"
          class="hide-sm hide-md col-3 float-left"
        />
        <div class="col-12 col-md-9 float-left pl-0 pl-md-4">
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
                {{ _num(token.myBalance) }}
              </div>
              <div class="column-sm">
                {{ _num(getTokenAmountOut(token)) }}
              </div>
            </UiTableTr>
          </UiTable>
          <UiTable class="mt-4">
            <UiTableTh class="text-left flex-items-center text-white">
              <div class="flex-auto">Amount</div>
              <div class="ml-2">
                {{ _num(poolTokenBalance) }} {{ _shorten(pool.symbol, 12) }}
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
      <div class="mx-4">
        <MessageError
          v-if="validationError"
          :text="validationError"
          class="mb-4"
        />
        <MessageSlippage
          v-if="slippage"
          :value="slippage"
          :isDeposit="false"
          class="mb-4"
        />
      </div>
      <template slot="footer">
        <UiButton
          :disabled="validationError || loading"
          type="submit"
          class="button-primary ml-2"
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
import { getAddress } from '@ethersproject/address';
import {
  bnum,
  normalizeBalance,
  denormalizeBalance,
  liquidityToggleOptions
} from '@/helpers/utils';
import { calcSingleOutGivenPoolIn } from '@/helpers/math';
import { validateNumberInput, formatError } from '@/helpers/validation';

export default {
  props: ['open', 'pool', 'bPool'],
  data() {
    return {
      liquidityToggleOptions,
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
      const balance = this.web3.balances[
        getAddress(this.bPool.getBptAddress())
      ];
      return normalizeBalance(balance || '0', 18);
    },
    userLiquidity() {
      const poolSharesFrom = this.poolTokenBalance;
      const totalShares = parseFloat(this.pool.totalShares);
      const current = poolSharesFrom / totalShares;
      if (this.validationError) {
        return {
          absolute: {
            current: poolSharesFrom
          },
          relative: {
            current
          }
        };
      }

      const poolTokens = parseFloat(this.poolAmountIn);
      const future = (poolSharesFrom - poolTokens) / (totalShares - poolTokens);
      return {
        absolute: {
          current: poolSharesFrom,
          future: poolSharesFrom + poolTokens
        },
        relative: {
          current,
          future
        }
      };
    },
    tokens() {
      return this.pool.tokens.map(token => {
        token.myBalance = this.getTokenBalance(token);
        return token;
      });
    },
    validationError() {
      const amountError = validateNumberInput(this.poolAmountIn);
      const amountErrorText = formatError(amountError);
      if (amountErrorText) return amountErrorText;
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
    slippage() {
      if (this.validationError) return undefined;
      if (this.isMultiAsset) return undefined;

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
      return bnum(1).minus(tokenAmountOut.div(expectedTokenAmountOut));
    },
    isMultiAsset() {
      return this.type === 'MULTI_ASSET';
    }
  },
  methods: {
    ...mapActions(['exitPool', 'exitswapPoolAmountIn']),
    async handleSubmit() {
      this.loading = true;
      const poolAddress = this.pool.crp ? this.pool.controller : this.pool.id;
      if (this.isMultiAsset) {
        await this.exitPool({
          poolAddress,
          poolAmountIn: this.poolAmountIn,
          minAmountsOut: this.pool.tokens.map(() => 0) // @TODO add amounts
        });
      } else {
        const tokenOutAddress = this.activeToken;
        await this.exitswapPoolAmountIn({
          poolAddress,
          tokenOutAddress,
          poolAmountIn: this.poolAmountIn,
          minTokenAmountOut: '0'
        });
      }
      this.$emit('close');
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
