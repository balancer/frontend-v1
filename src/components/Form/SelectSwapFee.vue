<template>
  <div class="p-4">
    <p class="mb-4">
      There is a minimum swap fee of
      <a class="link-text" @click="setSwapFee(0.0001)">0.0001%</a> and a maximum
      of <a class="link-text" @click="setSwapFee(10)">10%</a>.
    </p>
    <UiTable>
      <UiTableTh>
        <div class="flex-auto text-left">
          Swap Fee (%)
        </div>
        <input
          type="number"
          class="input"
          placeholder="0.0001"
          value="0.15"
          step="0.0001"
          min="0.0001"
          max="10"
          @input="$emit('input', swapFee)"
          v-model="swapFee"
        />
      </UiTableTh>
    </UiTable>
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
  },
  methods: {
    setSwapFee(swapFee) {
      this.swapFee = swapFee;
      this.$emit('input', swapFee);
    }
  }
};
</script>
