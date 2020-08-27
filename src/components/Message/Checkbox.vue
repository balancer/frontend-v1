<template>
  <div id="error" class="d-flex flex-items-center px-4 py-2">
    <UiCheckbox class="error" :checked="accepted" @change="$emit('toggle')" />
    <div class="ml-4">
      <div v-if="custom">
        • Do not add <b>deflationary tokens</b> or tokens with transfer fees.
      </div>
      <div v-if="custom">
        • Do not add tokens with <b>no bool return values</b>.
      </div>
      <div v-if="custom">
        • Any other <b>non-standard behavior from ERC20</b> may cause issues.
        DYOR!
      </div>
      <div>
        • Do not add tokens you don't trust or whose rules over minting and
        blacklisting you don’t agree with.
      </div>
      <div>
        • By checking this box you agree that Balancer Labs is not liable for
        any losses or issues you might have as a direct or indirect result from
        adding liquidity to this pool.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['custom', 'accepted']
};
</script>

<style scoped lang="scss">
@import '../../vars';

#error {
  border: 1px solid $error;
  border-radius: 4px;
  color: $error;
}
</style>
