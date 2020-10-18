<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('addRemoveTokens')" class="text-white" />
      </template>
      <UiTable v-if="step === 0" class="m-4">
        <UiTableTh>
          <div v-text="$t('tokens')" class="flex-auto text-left" />
        </UiTableTh>
        <UiTableTr v-for="(token, i) in pool.metadata.tokens" :key="i">
          <Token :address="token.checksum" class="mr-2" />
          <div class="flex-auto text-left">
            {{ _ticker(token.checksum) }}
          </div>
          <a @click="handleRemoveToken(token.checksum)" class="mt-n2 mr-n3">
            <Icon name="close" class="p-3" />
          </a>
        </UiTableTr>
      </UiTable>
      <div v-if="step === 1" class="m-4 px-4 text-center">
        <h4
          v-text="
            `Are you sure you want to remove the token ${_ticker(
              pendingRemove
            )} from the pool?`
          "
          class="mb-3"
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
          :disabled="step !== 1 || loading"
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

export default {
  props: ['open', 'pool'],
  data() {
    return {
      step: 0,
      loading: false,
      pendingRemove: ''
    };
  },
  watch: {
    async open() {
      this.step = 0;
      this.loading = false;
      this.pendingRemove = '';
    }
  },
  methods: {
    ...mapActions(['removeToken']),
    async handleSubmit() {
      this.loading = true;
      await this.removeToken({
        poolAddress: this.pool.getBptAddress(),
        token: this.pendingRemove
      });
      this.loading = false;
    },
    handleRemoveToken(token) {
      this.pendingRemove = token;
      this.step = 1;
    }
  }
};
</script>
