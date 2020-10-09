<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 600px;">
    <div class="modal-body p-6 text-white">
      <div class="mb-2">
        Before creating this pool, make sure the {{ type }} information below is
        correct:
      </div>
      <div v-for="(value, index) in values" :key="index">
        <b>{{ value }}</b>
      </div>
      <div class="mt-2">
        If these {{ type }}s are not correct, you are vulnerable to loss of
        funds through arbitrage. You can click on <Icon name="lock" size="16" />
        to toggle manual input.
      </div>
      <div class="mt-2">
        By continuing you agree that Balancer Labs is not liable for any losses
        you may incur.
      </div>
      <div class="mt-4 d-flex flex-items-center flex-justify-center">
        <UiButton
          class="button-primary"
          @click="[$emit('create'), $emit('close')]"
        >
          Continue
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open', 'padlock', 'tokens', 'amounts', 'weights'],
  computed: {
    type() {
      return this.padlock ? 'price' : 'amount';
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
