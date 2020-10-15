<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <UiModalForm @submit="handleSubmit">
      <template slot="header">
        <h3 v-text="$t('editCap')" class="text-white" />
      </template>
      <div class="text-center m-4">
        <h5 class="px-4 mb-4 mx-auto overflow-hidden" style="max-width: 340px;">
          {{ $t('changePoolSupplyCap') }}
        </h5>
        <div class="text-center m-4 mt-0">
          <Toggle
            :value="type"
            :options="capInputOptions"
            @select="handleSelectType"
            class="mt-4"
          />
        </div>
        <input
          type="number"
          class="h3 py-2 px-3 input text-center"
          placeholder="100"
          :class="isValid ? 'text-white' : 'text-red'"
          :min="0"
          :step="1"
          :disabled="'UNLIMITED' == this.type"
          v-model="input"
        />
      </div>
      <template slot="footer">
        <UiButton @click="$emit('close')" type="button" class="mx-1">
          {{ $t('cancel') }}
        </UiButton>
        <UiButton
          :disabled="loading || (input === value && 'NUMERIC' == type)"
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
import { mapActions } from 'vuex';
import { validateNumberInput, ValidationError } from '@/helpers/validation';
import { MAX, capInputOptions } from '@/helpers/utils';

export default {
  props: ['open', 'value', 'pool'],
  data() {
    return {
      loading: false,
      input: false,
      type: false,
      capInputOptions
    };
  },
  watch: {
    open() {
      this.loading = false;
      this.input = this.value === MAX ? '' : this.value.replace('.0', '');
      this.type = this.value === MAX ? 'UNLIMITED' : 'NUMERIC';
    }
  },
  computed: {
    isValid() {
      const error = validateNumberInput(this.input);
      // For some reason "0" returns NOT_A_NUMBER; expected NOT_POSITIVE
      return (
        error === ValidationError.NONE || error === ValidationError.NOT_A_NUMBER
      );
    }
  },
  methods: {
    ...mapActions(['setCap']),
    async handleSubmit() {
      this.loading = true;
      try {
        this.tx = await this.setCap({
          poolAddress: this.pool.controller,
          newCap: 'UNLIMITED' == this.type ? MAX.toString() : this.input
        });
        this.$emit('close');
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
    handleSelectType(type) {
      this.type = type;
    }
  }
};
</script>
