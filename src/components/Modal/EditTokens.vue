<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('addRemoveTokens')" class="text-white" />
      </template>
      <UiTable v-if="step === 0" class="m-4">
        <UiTableTh>
          <div v-text="$t('tokens')" class="flex-auto text-left" />
          <div v-text="$t('balance')" class="flex-auto text-left" />
        </UiTableTh>
        <UiTableTr v-for="(token, i) in pool.metadata.tokens" :key="i">
          <Token :address="token.checksum" class="mr-2" />
          <div class="flex-auto text-left">
            {{ _ticker(token.checksum) }}
          </div>
          <div
            v-text="_precision(parseFloat(token.balance), token.checksum)"
            class="flex-auto text-left"
          />
          <a
            @click="handleRemoveToken(token.checksum, token.denormWeight)"
            class="mt-n2 mr-n3"
          >
            <Icon name="close" class="p-3" />
          </a>
        </UiTableTr>
      </UiTable>

      <!-- disabled for now -->
      <div class="text-center mb-4">
        <UiButton
          v-if="pool.metadata.tokens.length < 8 && step === 0"
          :disabled="true"
        >
          {{ $t('addToken') }}
        </UiButton>
      </div>

      <div v-if="step === 1" class="m-4 px-4 text-center">
        <h4
          v-text="
            `${$t('confirmRemove')} ${_ticker(pendingRemove)} ${$t('fromPool')}`
          "
          class="mb-3"
        />

        <h5 class="mb-3">
          {{ $t('willBurn') }}
          {{ _num(poolAmountIn / 1e18) }}
          {{ pool.metadata.symbol }}
        </h5>

        <ButtonUnlock
          v-if="allowance < poolAmountIn"
          :tokenAddress="pool.getBptAddress()"
          :amount="poolAmountIn"
          :decimals="18"
          @approved="allowance = poolAmountIn"
          class="button-primary mb-3"
        />
        <div class="d-flex flex-items-center text-left p-3 warning-box">
          <Icon name="warning" size="22" class="mr-3" />
          <div v-html="$t('removeTokenWarning')" />
        </div>
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="step !== 1 || loading || poolAmountIn > allowance"
          :loading="loading"
          class="button-primary mx-1"
        >
          {{ $t('confirm') }}
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { calcPoolInGivenTokenRemove } from '@/helpers/math';
import { bnum, denormalizeBalance } from '@/helpers/utils';

export default {
  props: ['open', 'pool'],
  data() {
    return {
      step: 0,
      allowance: 0,
      loading: false,
      pendingRemove: '',
      pendingWeight: 0
    };
  },
  watch: {
    async open() {
      this.step = 0;
      this.loading = false;
      this.pendingRemove = '';
      this.pendingWeight = 0;
    }
  },
  computed: {
    poolAmountIn() {
      return calcPoolInGivenTokenRemove(
        bnum(this.pool.metadata.totalWeight).times('1e18'),
        denormalizeBalance(this.pool.metadata.totalShares, 18),
        bnum(this.pendingWeight).times('1e18')
      );
    }
  },
  methods: {
    ...mapActions(['removeToken', 'getAllowances']),
    async handleSubmit() {
      this.loading = true;
      await this.removeToken({
        poolAddress: this.pool.metadata.controller,
        token: this.pendingRemove,
        poolAmountIn: this.poolAmountIn
      });
      this.loading = false;
      this.$emit('close');
    },
    async handleRemoveToken(tokenAddress, tokenWeight) {
      this.pendingRemove = tokenAddress;
      this.pendingWeight = tokenWeight;
      this.step = 1;
      const allowances = await this.getAllowances([this.pool.getBptAddress()]);
      this.allowance = parseInt(
        allowances[this.pool.getBptAddress()][this.web3.dsProxyAddress]
      );
    }
  }
};
</script>
