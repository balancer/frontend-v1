<template>
  <div
    class="d-flex flex-items-center p-4"
    :class="{ 'info-box': !isWarning, 'warning-box': isWarning }"
  >
    <Icon v-if="isWarning" name="warning" size="22" class="mr-4" />
    <Icon v-else name="info" size="22" class="mr-4" />
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['value', 'isDeposit'],
  computed: {
    text() {
      const action = this.isDeposit ? this.$t('adding') : this.$t('removing');
      const percentage = this._num(this.value, 'percent');
      return `${action} ${this.$t('liquidityIncurs')} ${percentage} ${this.$t(
        'ofSlippage'
      )}`;
    },
    isWarning() {
      return this.value.gte(0.01);
    }
  }
};
</script>
