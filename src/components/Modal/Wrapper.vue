<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t(title)" class="text-white" />
      </template>
      <div class="m-4 p-4 border rounded-2">
        <div class="mb-2">
          {{ $t('send') }}
        </div>
        <UiButton
          type="button"
          class="d-flex flex-items-center mb-3 width-full"
        >
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
            <UiLabel v-text="'Max'" />
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
        <UiButton
          type="button"
          class="d-flex flex-items-center mb-2 width-full"
        >
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
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || !amount || !isValid"
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
import { validateNumberInput, ValidationError } from '@/helpers/validation';
import { normalizeBalance } from '@/helpers/utils';
import { mapActions } from 'vuex';

export default {
  props: ['open', 'side'],
  data() {
    return {
      currentSide: 1,
      amount: '',
      loading: false
    };
  },
  watch: {
    open() {
      if (this.side) this.currentSide = this.side;
      this.loading = false;
      this.amount = '';
    }
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
      if (error !== ValidationError.NONE && error !== ValidationError.EMPTY)
        return false;
      return !this.balance.lt(this.amount);
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
      this.amount = this.balance.toString();
    },
    toggleSide() {
      this.currentSide = this.currentSide === 1 ? 2 : 1;
      this.amount = '';
      this.loading = false;
    }
  }
};
</script>
