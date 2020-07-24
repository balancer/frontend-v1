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
          <UiTableTr v-for="token in pool.tokens" :key="token.checksum">
            <div
              class="column-lg flex-auto d-flex flex-items-center text-left d-flex"
            >
              <UiRadio
                class="mr-1"
                v-if="!isMultiAsset"
                :checked="activeToken === token.checksum"
                :onChange="
                  e => {
                    onTokenSelect(token.checksum);
                  }
                "
              />
              <Token :address="token.address" class="mr-2" size="20" />
              <div class="text-white">{{ token.symbol }}</div>
              <ButtonUnlock class="ml-2" :tokenAddress="token.checksum" />
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
                  v-model="amounts[token.checksum]"
                  v-if="isMultiAsset || activeToken === token.checksum"
                  class="input flex-auto text-right"
                  :class="isInputValid(token) ? 'text-white' : 'text-red'"
                  placeholder="0.0"
                  @input="handleChange(amounts[token.checksum], token)"
                />
              </div>
            </div>
          </UiTableTr>
        </UiTable>
      </div>
      <template slot="footer">
        <MessageError v-if="tokenError" :text="tokenError" class="mb-4" />
        <MessageError
          v-if="validationError"
          :text="validationError"
          class="mb-4"
        />
        <MessageError v-if="transferError" :text="transferError" class="mb-4" />
        <MessageCustomToken
          v-if="hasCustomToken"
          :accepted="customTokenAccept"
          @toggle="customTokenAccept = !customTokenAccept"
          class="mb-4 text-left"
        />
        <MessageWarningRateChange
          v-if="rateChangeWarning"
          @lower="lowerAmounts"
          class="mb-4"
        />
        <MessageWarning
          v-if="slippageWarning"
          :text="slippageWarning"
          class="mb-4"
        />
        <UiButton
          type="submit"
          :disabled="
            tokenError ||
              validationError ||
              hasLockedToken ||
              (hasCustomToken && !customTokenAccept)
          "
          :loading="loading"
        >
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
import config from '@/helpers/config';
import { LiquidityType } from '@/components/SingleMultiToggle';

const BALANCE_BUFFER = 0.01;

export default {
  props: ['open', 'pool'],
  data() {
    return {
      loading: false,
      poolTokens: null,
      amounts: {},
      type: LiquidityType.MULTI_ASSET,
      activeToken: null,
      customTokenAccept: false,
      transactionFailed: false
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.checksum, ''];
        })
      );
      this.type = LiquidityType.MULTI_ASSET;
      this.activeToken = this.pool.tokens[0].checksum;
    }
  },
  computed: {
    userShare() {
      const poolSharesFrom = this.subgraph.poolShares[this.pool.id] || 0;
      const totalShares = parseFloat(this.pool.totalShares);
      const current = poolSharesFrom / totalShares;
      if (this.validationError) {
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
    tokenError() {
      if (
        this.pool.tokens.some(token => config.errors.includes(token.checksum))
      ) {
        return 'This pool contains a deflationary token that is likely to cause loss of funds. Do not deposit.';
      }
      return undefined;
    },
    validationError() {
      if (this.tokenError) {
        return undefined;
      }
      const tokens = this.pool.tokensList;
      // Basic input validation
      for (const token of tokens) {
        if (!this.isMultiAsset && this.activeToken !== token) {
          continue;
        }
        if (!this.amounts[token]) {
          return `Values can't be empty`;
        }
      }
      for (const token of tokens) {
        if (!this.isMultiAsset && this.activeToken !== token) {
          continue;
        }
        if (isNaN(this.amounts[token])) {
          return 'Values should be numbers';
        }
      }
      for (const token of tokens) {
        if (!this.isMultiAsset && this.activeToken !== token) {
          continue;
        }
        if (parseFloat(this.amounts[token]) <= 0) {
          return 'Values should be positive numbers';
        }
      }
      // Amount validation
      for (const token of tokens) {
        if (!this.isMultiAsset && this.activeToken !== token) {
          continue;
        }
        const amount = bnum(this.amounts[token]);
        const balance = normalizeBalance(
          this.web3.balances[token],
          this.web3.tokenMetadata[token].decimals
        );
        if (amount.gt(balance)) {
          return 'Token amount should not exceed balance';
        }
      }
      // Max in ratio validation
      if (!this.isMultiAsset) {
        const maxInRatio = 1 / 2;
        const amount = bnum(this.amounts[this.activeToken]);
        const tokenIn = this.pool.tokens.find(
          token => token.checksum === this.activeToken
        );
        if (amount.div(tokenIn.balance).gt(maxInRatio)) {
          return 'Insufficient pool liquidity';
        }
      }
      return undefined;
    },
    transferError() {
      if (this.tokenError || this.validationError) {
        return undefined;
      }
      if (!this.transactionFailed) {
        return undefined;
      }
      if (this.hasToken(this.pool, 'SNX')) {
        return 'Adding liquidity failed as your SNX is locked in staking.';
      }
      const synths = ['sUSD', 'sBTC', 'sETH', 'sXAU', 'sXAG', 'sDEFI'];
      if (synths.some(synth => this.hasToken(this.pool, synth))) {
        return 'Adding liquidity failed as your Synthetix position might go underwater. ';
      }
      const aTokens = [
        'aDAI',
        'aUSDT',
        'aUSDC',
        'aSUSD',
        'aTUSD',
        'aBUSD',
        'aBAT',
        'aETH',
        'aKNC',
        'aLEND',
        'aLINK',
        'aMANA',
        'aMKR',
        'aREP',
        'aSNX',
        'aWBTC',
        'aZRX'
      ];
      if (aTokens.some(aToken => this.hasToken(this.pool, aToken))) {
        return 'Adding liquidity failed as your Aave position might go underwater. ';
      }
      const cTokens = [
        'cUSDC',
        'cDAI',
        'cETH',
        'cUSDT',
        'cREP',
        'cZRX',
        'cBAT',
        'cWBTC'
      ];
      if (cTokens.some(cToken => this.hasToken(this.pool, cToken))) {
        return 'Adding liquidity failed as your Compound position might go underwater. ';
      }
      return 'Adding liquidity failed as one of the underlying tokens blocked the transfer. ';
    },
    hasLockedToken() {
      const proxyAddress = this.web3.dsProxyAddress;
      for (const token of this.pool.tokensList) {
        const tokenAllowance = this.web3.allowances[token];
        if (!tokenAllowance || !tokenAllowance[proxyAddress]) {
          return true;
        }
        const allowance = tokenAllowance[proxyAddress];
        if (allowance === '0') {
          return true;
        }
      }
      return false;
    },
    hasCustomToken() {
      if (this.validationError || this.tokenError) {
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
    rateChangeWarning() {
      if (this.validationError || this.tokenError) {
        return false;
      }
      if (!this.isMultiAsset) {
        return false;
      }
      const token = this.findFrontrunnableToken;
      if (!token) {
        return false;
      }
      const frontrunningThreshold = 1 - BALANCE_BUFFER;
      const address = token.checksum;
      const amount = bnum(this.amounts[address]);
      const denormAmount = denormalizeBalance(amount, token.decimals);
      const balance = this.web3.balances[address];
      const amountToBalanceRatio = denormAmount.div(balance);
      return (
        amountToBalanceRatio.gt(frontrunningThreshold) &&
        amountToBalanceRatio.lte(1)
      );
    },
    slippageWarning() {
      if (this.validationError || this.tokenError) {
        return undefined;
      }
      if (this.isMultiAsset) {
        return undefined;
      }
      const slippageThreshold = 0.01;
      const tokenInAddress = this.activeToken;
      if (!this.amounts[tokenInAddress]) {
        return undefined;
      }
      const tokenIn = this.pool.tokens.find(
        token => token.checksum === tokenInAddress
      );
      const amount = bnum(this.amounts[tokenInAddress]);

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

      const poolAmountOut = calcPoolOutGivenSingleIn(
        tokenBalanceIn,
        tokenWeightIn,
        poolSupply,
        totalWeight,
        tokenAmountIn,
        swapFee
      );
      const expectedPoolAmountOut = tokenAmountIn
        .times(tokenWeightIn)
        .times(poolSupply)
        .div(tokenBalanceIn)
        .div(totalWeight);
      const one = bnum(1);
      const slippage = one.minus(poolAmountOut.div(expectedPoolAmountOut));
      if (slippage.gte(slippageThreshold)) {
        const slippageString = slippage.times(100).toFixed(2);
        return `Adding liquidity will incur ${slippageString}% of slippage`;
      }
      return undefined;
    },
    findFrontrunnableToken() {
      if (this.validationError) {
        return;
      }
      let maxAmountToBalanceRatio = bnum(0);
      let maxRatioToken = undefined;
      for (const token of this.pool.tokens) {
        const address = token.checksum;
        const amount = bnum(this.amounts[address]);
        const denormAmount = denormalizeBalance(amount, token.decimals);
        const balance = this.web3.balances[address];
        const amountToBalanceRatio = denormAmount.div(balance);
        if (amountToBalanceRatio.gt(maxAmountToBalanceRatio)) {
          maxAmountToBalanceRatio = amountToBalanceRatio;
          maxRatioToken = token;
        }
      }
      return maxRatioToken;
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
          token => token.checksum === this.activeToken
        );
        const amount = new BigNumber(this.amounts[tokenIn.checksum]);

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
        if (token.checksum === changedToken.checksum) {
          return;
        }
        this.amounts[token.checksum] = ratio.times(token.balance).toString();
      });
    },
    handleMax(token) {
      const balance = this.web3.balances[token.checksum];
      const amount = normalizeBalance(balance, token.decimals);
      this.amounts[token.checksum] = amount.toString();
      this.handleChange(amount, token);
    },
    lowerAmounts() {
      const frontrunningThreshold = 1 - BALANCE_BUFFER;
      const token = this.findFrontrunnableToken;
      const address = token.checksum;
      const balance = this.web3.balances[address];
      const safeAmount = bnum(balance).times(frontrunningThreshold);
      const normalizedAmount = normalizeBalance(safeAmount, token.decimals);
      this.amounts[token.checksum] = normalizedAmount.toString();
      this.handleChange(normalizedAmount, token);
    },
    onTypeSelect(type) {
      this.type = type;
      this.poolTokens = null;
      this.amounts = Object.fromEntries(
        this.pool.tokens.map(token => {
          return [token.checksum, ''];
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
            const amount = bnum(this.amounts[token.checksum]);
            return denormalizeBalance(amount, token.decimals)
              .integerValue(BigNumber.ROUND_UP)
              .toString();
          })
        };
        await this.joinPool(params);
      } else {
        const tokenIn = this.pool.tokens.find(
          token => token.checksum === this.activeToken
        );
        const tokenAmountIn = denormalizeBalance(
          this.amounts[tokenIn.checksum],
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
    isInputValid(token) {
      const tokenAddress = token.checksum;
      if (!this.isMultiAsset && this.activeToken !== tokenAddress) {
        return true;
      }
      const amount = this.amounts[tokenAddress];
      if (!amount || isNaN(amount)) {
        return false;
      }
      const amountNumber = denormalizeBalance(amount, token.decimals);
      const balance = this.web3.balances[tokenAddress];
      return amountNumber.lte(balance);
    },
    hasToken(pool, symbol) {
      const tokenAddress = Object.keys(this.web3.tokenMetadata).find(
        tokenAddress => this.web3.tokenMetadata[tokenAddress].symbol === symbol
      );
      return pool.tokensList.includes(tokenAddress);
    },
    formatBalance(balanceString, tokenDecimals) {
      return normalizeBalance(balanceString, tokenDecimals);
    }
  }
};
</script>
