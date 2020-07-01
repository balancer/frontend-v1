<template>
  <div class="p-4">
    <UiTable>
      <UiTableTh>
        <div class="flex-auto text-left">
          Swap fee (%)
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
  }
};
</script>
