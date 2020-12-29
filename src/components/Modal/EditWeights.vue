<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('editTokenWeights')" class="text-white" />
      </template>
      <UiTable class="m-4">
        <UiTableTh>
          <div v-text="$t('tokens')" class="flex-auto text-left" />
          <div v-text="$t('weights')" class="column-sm" />
          <div v-text="$t('percent')" class="column" />
        </UiTableTh>
        <UiTableTr v-for="(token, i) in pool.tokens" :key="token.checksum">
          <Token :address="token.checksum" size="28" class="mr-2" />
          <div class="flex-auto text-left">
            {{ _ticker(token.checksum) }}
          </div>
          <div class="column-sm text-right">
            <input
              :value="weights[i]"
              class="input text-right ml-4"
              :class="validationError ? 'text-red' : 'text-white'"
              placeholder="50"
              @input="
                e => {
                  handleInputChange(i, e.target.value);
                }
              "
            />
          </div>
          <div class="column text-right">
            {{ _num(initialPercentages[i].toFixed(4), 'percent') }}
            → {{ _num((weights[i] / totalWeight).toFixed(4), 'percent') }}
          </div>
        </UiTableTr>
      </UiTable>
      <div
        v-if="isLocked"
        class="my-2 text-center"
        v-text="`${$t('unlock')} ${tokenToSpend.symbol} ${$t('toContinue')}.`"
      >
        <ButtonUnlock
          :tokenAddress="tokenToSpend.address"
          :amount="amountToSpend"
          :decimals="tokenToSpend.decimals"
        />
      </div>
      <MessageError
        v-if="validationError"
        :text="validationError"
        class="mt-4"
      />
      <MessageWarning v-if="validUpdate" :text="validUpdate" class="mt-4" />
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || !isValid"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          {{ $t('confirm') }}
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { getAddress } from '@ethersproject/address';
import { mapActions } from 'vuex';
import {
  calcSingleInGivenWeightIncrease,
  calcSingleOutGivenWeightDecrease,
  calcPoolInGivenWeightDecrease,
  calcPoolOutGivenWeightIncrease
} from '@/helpers/math';
import { bnum, toWei, scale, isLocked } from '@/helpers/utils';
import { getDivisor } from '@/helpers/weights';

export default {
  props: ['open', 'pool', 'defaultValue'],
  data() {
    return {
      loading: false,
      tokenIndex: 0,
      initialPercentages: [],
      weights: [],
      divisor: 0,
      maxPercentage: 0
    };
  },
  watch: {
    open() {
      this.loading = false;
      // If we're in this dialog, we know it's a smart pool with changeable weights
      //   so "isSharedOrLockedSmartPool" has to be false
      this.divisor = getDivisor(false);
      this.maxPercentage = 100 - this.divisor;
      this.weights = this.pool.tokens.map(
        token => this.divisor * parseFloat(token.denormWeight)
      );
      this.initialPercentages = this.pool.tokens.map(
        token =>
          parseFloat(token.denormWeight) / parseFloat(this.pool.totalWeight)
      );
    }
  },
  computed: {
    totalWeight() {
      return this.weights.reduce((a, b) => a + parseFloat(b), 0);
    },
    tokenToSpend() {
      if (this.isWeightIncrease) {
        const token = this.pool.tokens[this.tokenIndex];

        // Return an object here, including the decimals
        // If it is a BPT, we know it is 18 decimals - and it might not be in the metadata
        //   If it's not in the metadata and we don't pass decimals, it will blow up in Unlock
        return {
          address: token.checksum,
          symbol: token.symbol,
          decimals: this.web3.tokenMetadata[token.checksum]
        };
      } else if (this.isWeightDecrease) {
        return {
          address: getAddress(this.pool.controller),
          symbol: this.pool.symbol,
          decimals: 18
        };
      }

      return { address: undefined, symbol: undefined, decimals: undefined };
    },
    amountToSpend() {
      const token = this.pool.tokens[this.tokenIndex];
      if (this.isWeightIncrease) {
        const tokenAmountIn = calcSingleInGivenWeightIncrease(
          scale(bnum(token.balance), token.decimals),
          toWei(token.denormWeight),
          toWei(this.weights[this.tokenIndex])
        );
        return tokenAmountIn.toString();
      } else if (this.isWeightDecrease) {
        const totalWeight =
          this.totalWeight +
          this.divisor * parseFloat(token.denormWeight) -
          parseFloat(this.weights[this.tokenIndex]);
        const poolAmountIn = calcPoolInGivenWeightDecrease(
          toWei(totalWeight),
          toWei(token.denormWeight * this.divisor),
          toWei(this.weights[this.tokenIndex]),
          bnum(this.pool.totalShares)
        );
        return poolAmountIn.toString();
      }
      return '0';
    },
    isLocked() {
      if (!this.tokenToSpend.address) {
        return false;
      }
      return isLocked(
        this.web3.allowances,
        this.tokenToSpend.address,
        this.web3.dsProxyAddress,
        this.amountToSpend,
        this.tokenToSpend.decimals
      );
    },
    isWeightIncrease() {
      const weight =
        this.divisor *
        parseFloat(this.pool.tokens[this.tokenIndex].denormWeight);
      const newWeight = parseFloat(this.weights[this.tokenIndex]);
      return newWeight > weight;
    },
    isWeightDecrease() {
      const weight =
        this.divisor *
        parseFloat(this.pool.tokens[this.tokenIndex].denormWeight);
      const newWeight = parseFloat(this.weights[this.tokenIndex]);
      return newWeight < weight;
    },
    validationError() {
      // Ensure percentages are within the valid range (user can type any numbers)
      const totalWeight = this.weights.reduce((a, b) => a + parseFloat(b), 0);

      for (let idx = 0; idx < this.weights.length; idx++) {
        const percentage = (this.weights[idx] / totalWeight) * 100;

        if (percentage < this.divisor || percentage > this.maxPercentage) {
          return this.$t('errInvalidDenorm', {
            min: this.divisor,
            max: this.maxPercentage
          });
        }
      }

      return false;
    },
    isValid() {
      // This controls the confirm button - ok to confirm if we're changing something, and it's valid
      const isWeightChange = this.isWeightIncrease || this.isWeightDecrease;

      return isWeightChange && !this.validationError;
    },
    validUpdate() {
      // This calculates and displays all the token transfers this weight update will do
      // The unlock logic additionally ensures we have approval to transfer (either the token, or the BPT)

      if (this.is_valid) {
        // If it is a weight increase, we are depositing tokens and minting BPTs
        // If it is a weight decrease, we are withdrawing tokens and burning BPTs

        // The tokenToSpend logic only cares about which token we're depositing; won't be set if we're burning BPT
        // We need the constituent token too, since we are also calculating and displaying tokens coming out of the pool
        const selectedToken = this.pool.tokens[this.tokenIndex];
        const tokenSymbol = this.isWeightDecrease
          ? selectedToken.symbol
          : this.tokenToSpend.symbol;

        const totalWeight = this.isWeightDecrease
          ? 0 // if a decrease, we don't need the total, so don't waste cycles on it
          : this.totalWeight +
            this.divisor * parseFloat(selectedToken.denormWeight) -
            parseFloat(this.weights[this.tokenIndex]);

        const tokenAmount = this.isWeightDecrease
          ? calcSingleOutGivenWeightDecrease(
              bnum(selectedToken.balance),
              toWei(selectedToken.denormWeight * this.divisor),
              toWei(this.weights[this.tokenIndex])
            ).toFixed(2)
          : scale(bnum(this.amountToSpend), -selectedToken.decimals).toFixed(2);

        const bptAmount = this.isWeightDecrease
          ? this.amountToSpend
          : calcPoolOutGivenWeightIncrease(
              toWei(totalWeight),
              toWei(selectedToken.denormWeight * this.divisor),
              toWei(this.weights[this.tokenIndex]),
              bnum(this.pool.totalShares)
            );

        return this.$t('infoWeightUpdate', {
          tokenAction: this.isWeightDecrease
            ? this.$t('withdraw').toLowerCase()
            : this.$t('deposit').toLowerCase(),
          tokenAmount: tokenAmount,
          tokenSymbol: tokenSymbol,
          bptAction: this.isWeightDecrease ? this.$t('burn') : this.$t('mint'),
          bptAmount: bptAmount,
          bptSymbol: this.pool.symbol
        });
      }

      return false;
    }
  },
  methods: {
    ...mapActions(['increaseWeight', 'decreaseWeight']),
    handleInputChange(i, weight) {
      this.tokenIndex = i;
      this.weights = this.pool.tokens.map(
        token => this.divisor * parseFloat(token.denormWeight)
      );
      this.weights[i] = weight;
    },
    async handleSubmit() {
      this.loading = true;
      const token = this.pool.tokens[this.tokenIndex];
      if (this.isWeightIncrease) {
        const tokenWeiAmountIn = bnum(this.amountToSpend);
        const tokenAmountIn = scale(tokenWeiAmountIn, -token.decimals);
        await this.increaseWeight({
          poolAddress: this.pool.controller,
          token: token.checksum,
          newWeight: this.weights[this.tokenIndex],
          tokenAmountIn
        });
      } else {
        const poolWeiAmountIn = bnum(this.amountToSpend);
        const poolAmountIn = scale(poolWeiAmountIn, -18);
        await this.decreaseWeight({
          poolAddress: this.pool.controller,
          token: token.checksum,
          newWeight: this.weights[this.tokenIndex],
          poolAmountIn
        });
      }
      this.$emit('close');
      this.loading = false;
    }
  }
};
</script>
