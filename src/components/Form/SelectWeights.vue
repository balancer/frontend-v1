<template>
  <div class="p-4 pb-0">
    <div class="p-4 border rounded-1 text-center mb-4">
      <Pie :tokens="tokensForPie" size="120" />
    </div>
    <div class="border rounded-1">
      <UiTableTh class="border-bottom">
        <div class="flex-auto text-left">Tokens</div>
        <div class="column-sm">Weights</div>
      </UiTableTh>
      <div class="p-3">
        <div
          v-for="(token, i) in tokens"
          :key="token"
          class="d-flex flex-items-center mb-2"
        >
          <Token :address="token" size="28" class="mr-3" />
          <div class="flex-auto text-white">
            {{ config.tokens[token].symbol }}
          </div>
          <div class="column text-right pr-3">
            <div v-if="weightRatio * startWeights[i]">
              {{ $n((weightRatio * startWeights[i]).toFixed(2)) }}%
            </div>
          </div>
          <div class="column">
            <input
              v-model="startWeights[i]"
              type="number"
              class="input text-right btn-block"
              placeholder="0.0"
              min="2"
              max="98"
              @input="$emit('input', startWeights)"
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
  props: ['value', 'tokens'],
  data() {
    return {
      config,
      startWeights: []
    };
  },
  computed: {
    weightRatio() {
      return 100 / this.startWeights.reduce((a, b) => a + parseFloat(b), 0);
    },
    tokensForPie() {
      return this.tokens.map((token, i) => {
        return {
          address: token,
          weightPercent: this.weightRatio * this.startWeights[i]
        };
      });
    }
  },
  created() {
    if (this.value.length === this.tokens.length)
      return (this.startWeights = this.value);
    this.tokens.forEach(() =>
      this.startWeights.push((100 / this.tokens.length).toFixed())
    );
    this.$emit('input', this.startWeights);
  }
};
</script>
