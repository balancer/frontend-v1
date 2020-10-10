<template>
  <div class="p-4">
    <p class="mb-4">
      {{ $t('minimumSwapFee') }}
      <a class="link-text" @click="setSwapFee(0.0001)">0.0001%</a>
      {{ $t('andMax') }} <a class="link-text" @click="setSwapFee(10)">10%</a>.
    </p>
    <UiTable>
      <UiTableTh>
        <div v-text="$t('swapFeePct')" class="flex-auto text-left" />
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
