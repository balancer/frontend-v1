<template>
  <div
    class="d-flex flex-items-center p-4"
    :class="{ 'info-box': value.lt(0.01), 'warning-box': value.gte(0.01) }"
  >
    <Icon name="warning" size="22" class="mr-4" />
    {{ text }}
  </div>
</template>

<script>
export default {
  props: ['value', 'isDeposit'],
  computed: {
    text() {
      const action = this.isDeposit ? 'Adding' : 'Removing';
      const percentage = this._num(this.value, 'percent');
      return `${action} liquidity will incur ${percentage} of slippage`;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../vars';

.info-box {
  border: 1px solid $info;
  border-radius: 4px;
  color: $info;
}

.warning-box {
  border: 1px solid $warning;
  border-radius: 4px;
  color: $warning;
}
</style>
