<template>
  <span class="toggle mt-4">
    <UiButton
      @click="onSelect(multiAsset)"
      :class="selected === multiAsset && 'active'"
      class="border-0"
      type="button"
    >
      {{ actionName }} all assets
    </UiButton>
    <UiButton
      @click="onSelect(singleAsset)"
      :class="selected === singleAsset && 'active'"
      class="border-0"
      type="button"
    >
      {{ actionName }} one asset
    </UiButton>
  </span>
</template>

<script lang="ts">
export enum LiquidityType {
  MULTI_ASSET,
  SINGLE_ASSET
}

export default {
  props: ['selected', 'onSelect', 'action'],
  computed: {
    actionName() {
      return this.action === 'add' ? 'Deposit' : 'Withdraw';
    },
    multiAsset() {
      return LiquidityType.MULTI_ASSET;
    },
    singleAsset() {
      return LiquidityType.SINGLE_ASSET;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

.toggle {
  border-radius: 22px;
  display: inline-block;
  background-color: $secondary-button-background;

  .active {
    background-color: $primary-button-background !important;
  }
}
</style>
