<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 600px;">
    <div class="modal-body p-6 text-white">
      <div class="mb-2">
        {{ $t('beforeCreatingPre') }} {{ type }} {{ $t('beforeCreatingPost') }}:
      </div>
      <div v-for="(value, index) in values" :key="index">
        <b>{{ value }}</b>
      </div>
      <div class="mt-2">
        {{ $t('vulnerablePre') }}{{ type }}{{ $t('vulnerableMid') }}
        <Icon name="lock" size="16" />
        {{ $t('vulnerablePost') }}.
      </div>
      <div class="mt-2">{{ $t('disclaimer') }}.</div>
      <div class="mt-4 d-flex flex-items-center flex-justify-center">
        <UiButton
          class="button-primary"
          @click="[$emit('create'), $emit('close')]"
        >
          {{ $t('continue') }}
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
import i18n from '@/i18n';

export default {
  props: ['open', 'padlock', 'tokens', 'amounts', 'weights'],
  computed: {
    type() {
      return this.padlock ? i18n.tc('price') : i18n.tc('amount');
    },
    values() {
      if (this.padlock) {
        return this.tokens.map(token => {
          const symbol = this._ticker(token);
          const price = this._num(this.price.values[token] || 0, 'currency');
          return `1 ${symbol} = ${price}`;
        });
      } else {
        return this.tokens.map(token => {
          const symbol = this._ticker(token);
          const amount = this._num(this.amounts[token]);
          const weight = this._num(this.getRelativeWeight(token), 'percent');
          return `${amount} ${symbol} (${weight})`;
        });
      }
    }
  },
  methods: {
    getRelativeWeight(tokenAddress) {
      const absoluteWeight = this.weights[tokenAddress];
      const totalWeight = this.tokens.reduce((acc, val) => {
        const weight = parseFloat(this.weights[val]) || 0;
        return acc + weight;
      }, 0);
      if (!absoluteWeight || !totalWeight) {
        return 0;
      }
      return absoluteWeight / totalWeight;
    }
  }
};
</script>
