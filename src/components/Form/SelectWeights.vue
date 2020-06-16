<template>
  <div>
    <h2 class="mb-4">Set the weights</h2>
    <div>
      <Pie :tokens="tokensForPie" size="120" class="mb-4" />
    </div>
    <div class="px-4">
      <div class="d-flex text-right mb-3">
        <label class="flex-auto text-left">Tokens</label>
        <label class="column-sm">Weights</label>
      </div>
      <div class="mb-6 text-left">
        <div v-for="(token, i) in tokens" :key="token" class="border-top">
          <div class="d-flex my-2">
            <Token :address="token" size="40" class="mr-2 pr-1 mt-1" />
            <div class="mt-2 pt-1 text-gray mr-2">
              {{ config.tokens[token].symbol }}
            </div>
            <div class="flex-auto">
              <p class="my-2 py-1" v-if="weightRatio * weights[i]">
                {{ $n((weightRatio * weights[i]).toFixed(2)) }}%
              </p>
            </div>
            <input
              v-model="weights[i]"
              type="number"
              class="h2 border-0 form-control text-right ml-3 column"
              placeholder="0.0"
              min="2"
              max="98"
              @input="$emit('input', weights)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/helpers/config';

export default {
  props: ['tokens'],
  data() {
    return {
      config,
      weights: []
    };
  },
  computed: {
    weightRatio() {
      return 100 / this.weights.reduce((a, b) => a + parseFloat(b), 0);
    },
    tokensForPie() {
      return this.tokens.map((token, i) => {
        return {
          address: token,
          weightPercent: this.weightRatio * this.weights[i]
        };
      });
    }
  },
  created() {
    this.tokens.forEach(() => {
      this.weights.push((100 / this.tokens.length).toFixed());
    });
    this.$emit('input', this.weights);
  }
};
</script>
