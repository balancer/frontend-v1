<template>
  <div>
    <h2 class="mb-4">Preview</h2>
    <div class="px-4 text-left">
      <div>
        <label class="mb-3 d-block">Tokens</label>
      </div>
      <div>
        <label class="mb-3 d-block">Swap fee</label>
      </div>
      <div>
        <label class="mb-3 d-block">Rights</label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '@/helpers/config';

export default {
  props: ['tokens', 'weights'],
  data() {
    return {
      config,
      amounts: []
    };
  },
  computed: {
    ...mapGetters(['getPrice'])
  },
  methods: {
    handleAmountChange(tokenIndex) {
      const changedPrice = this.getPrice(
        this.tokens[tokenIndex],
        this.amounts[tokenIndex]
      );
      const changedWeight = this.weights[tokenIndex];
      const totalWeight = this.weights.reduce((a, b) => a + parseFloat(b), 0);
      const totalPrice = (changedPrice / changedWeight) * totalWeight;
      this.tokens.forEach((token, i) => {
        const price = this.getPrice(token, 1);
        if (price && i !== tokenIndex)
          this.amounts[i] = parseFloat(
            (((totalPrice / totalWeight) * this.weights[i]) / price).toFixed(4)
          );
      });
    }
  }
};
</script>
