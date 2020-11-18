<template>
  <UiModalForm @submit="handleSubmit">
    <h4 v-text="$t(title)" class="text-white px-4" />
    <div class="m-4 mb-6 p-4 border rounded-2">
      <div class="mb-2">
        {{ $t('send') }}
      </div>
      <UiButton type="button" class="d-flex flex-items-center mb-3 width-full">
        <input
          v-autofocus
          v-model="amount"
          :class="isValid ? 'text-white' : 'text-red'"
          :max="balance"
          type="number"
          step="any"
          class="flex-auto px-0"
        />
        <a @click="handleMax()" class="mx-3">
          <UiLabel v-text="$t('max')" />
        </a>
        {{ symbols.tokenIn }}
      </UiButton>
      <div class="mb-2">
        {{ $t('receive') }}
        <a
          @click="toggleSide()"
          v-text="'↕'"
          class="float-right mr-4 px-2 mt-n2"
        />
      </div>
      <UiButton type="button" class="d-flex flex-items-center mb-2 width-full">
        <input
          v-model="amount"
          :class="isValid ? 'text-white' : 'text-red'"
          type="number"
          step="any"
          class="flex-auto px-0"
          placeholder="0.0"
        />
        {{ symbols.tokenOut }}
      </UiButton>
      <div
        v-text="$t('ethBuffer')"
        class="text-yellow text-center mt-3"
        v-if="!etherLeft"
      />
    </div>
    <template slot="footer">
      <div class="col-6 float-left pr-2">
        <UiButton @click="$emit('close')" type="button" class="width-full">
          {{ $t('cancel') }}
        </UiButton>
      </div>
      <div class="col-6 float-left pl-2">
        <UiButton
          :requireLogin="true"
          :disabled="loading || !amount || !isValid"
          :loading="loading"
          type="submit"
          class="button-primary width-full"
        >
          {{ $t('confirm') }}
        </UiButton>
      </div>
    </template>
  </UiModalForm>
</template>

<script>
import { validateNumberInput, ValidationError } from '@/helpers/validation';
import { normalizeBalance } from '@/helpers/utils';
import { mapActions } from 'vuex';

const GAS_BUFFER_ERROR = 0.01;
const GAS_BUFFER_WARNING = 0.2;

export default {
  props: {
    side: Number
  },
  data() {
    return {
      currentSide: 1,
      amount: '',
      loading: false
    };
  },
  created() {
    this.currentSide = this.side;
    this.loading = false;
    this.amount = '';
  },
  computed: {
    title() {
      return this.currentSide === 2 ? 'wrapWethToEth' : 'wrapEthToWeth';
    },
    symbols() {
      return {
        tokenIn: this.currentSide === 2 ? 'WETH' : 'ETH',
        tokenOut: this.currentSide === 2 ? 'ETH' : 'WETH'
      };
    },
    balance() {
      let balance = this.web3.balances['ether'] || '0';
      if (this.currentSide === 2)
        balance = this.web3.balances[this.config.addresses.weth] || '0';
      return normalizeBalance(balance, 18);
    },
    isValid() {
      const error = validateNumberInput(this.amount);
      if (error !== ValidationError.NONE) return false;
      return this.currentSide === 1
        ? !this.balance.minus(GAS_BUFFER_ERROR).lt(this.amount)
        : !this.balance.lt(this.amount);
    },
    etherLeft() {
      return (
        this.currentSide === 2 ||
        this.balance.isZero() ||
        !this.balance.minus(GAS_BUFFER_WARNING).lt(this.amount)
      );
    }
  },
  methods: {
    ...mapActions(['wrap', 'unwrap']),
    async handleSubmit() {
      this.loading = true;
      if (this.currentSide === 1) await this.wrap(this.amount);
      if (this.currentSide === 2) await this.unwrap(this.amount);
      this.loading = false;
      this.$emit('close');
    },
    handleMax() {
      const maxAllowedAmount =
        this.currentSide === 1
          ? this.balance.minus(GAS_BUFFER_WARNING)
          : this.balance;
      this.amount = maxAllowedAmount.isNegative()
        ? '0'
        : maxAllowedAmount.toString();
    },
    toggleSide() {
      this.currentSide = this.currentSide === 1 ? 2 : 1;
      this.amount = '';
      this.loading = false;
    }
  }
};
</script>
