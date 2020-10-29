<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('manageWhitelist')" class="text-white" />
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          {{ $t('addOrRemoveLP') }}
        </h5>
        <input
          class="h3 py-2 px-3 input text-center"
          :class="isValid ? 'text-white' : 'text-red'"
          v-model="input"
        />
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          @click="operation = 'add'"
          :disabled="loading"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          {{ $t('add') }}
        </UiButton>
        <UiButton
          @click="operation = 'remove'"
          :disabled="loading"
          :loading="loading"
          type="submit"
          class="button-primary mx-1"
        >
          {{ $t('remove') }}
        </UiButton>
      </template>
    </UiModalForm>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';
import { isValidAddress } from '@/helpers/utils';

export default {
  props: ['open', 'value', 'pool'],
  data() {
    return {
      loading: false,
      input: false,
      operation: false
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.input = this.value;
      this.operation = '';
    }
  },
  computed: {
    isValid() {
      return isValidAddress(this.input);
    }
  },
  methods: {
    ...mapActions([
      'whitelistLiquidityProvider',
      'removeWhitelistedLiquidityProvider'
    ]),
    async handleSubmit() {
      this.loading = true;
      try {
        if (this.operation === 'add') {
          this.tx = await this.whitelistLiquidityProvider({
            poolAddress: this.pool.controller,
            provider: this.input
          });
        } else {
          this.tx = await this.removeWhitelistedLiquidityProvider({
            poolAddress: this.pool.controller,
            provider: this.input
          });
        }

        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    }
  }
};
</script>
