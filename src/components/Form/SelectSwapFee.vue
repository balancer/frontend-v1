<template>
  <div>
    <div class="px-4 mb-4 overflow-hidden">
      <h2 class="mb-3">Set a swap fee</h2>
      <p class="mb-3">
        Excepteur sint occaecat cupidatat non proident, sunt in.
      </p>
    </div>
    <div class="mb-4">
      <label class="d-block">Swap fee (%)</label>
      <input
        type="number"
        class="h1 border-0 form-control width-fit text-center"
        placeholder="0.0001"
        value="0.15"
        step="0.0001"
        min="0.0001"
        max="10"
        @input="$emit('input', swapFee)"
        v-model="swapFee"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  data() {
    return {
      swapFee: ''
    };
  },
  created() {
    this.swapFee = this.value;
  }
};
</script>
