<template>
  <div class="pool-overview Progress position-relative">
    <span
      v-for="(token, i) in tokens"
      :key="i"
      :style="`background-color: ${token.color}; width: ${token.weight}%;`"
      class="Progress-item text-center text-white"
    >
      <span
        :style="`left: ${i * 35}px`"
        class="position-absolute bottom-3 pr-2"
      >
        <Token :size="30" :address="token.address" class="border" />
      </span>
      <span
        class="position-absolute bottom-4 pb-1 right-0 pool-overview-symbol"
      >
        {{ token.symbol }}
        {{ _num(token.weight / 100, 'percent') }}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    tokens: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.pool-overview {
  background-color: transparent !important;
  overflow: visible !important;

  .pool-overview-symbol {
    display: none;
  }

  &:hover {
    .Progress-item {
      opacity: 0.1;
    }

    .Progress-item:hover {
      opacity: 1;

      .pool-overview-symbol {
        display: block;
      }
    }
  }

  .Progress-item {
    &:first-child {
      border-radius: 7px 0 0 7px !important;
    }

    &:last-child {
      border-radius: 0 7px 7px 0 !important;
    }
  }
}
</style>
