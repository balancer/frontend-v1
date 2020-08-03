<template>
  <div id="error" class="d-flex flex-items-center p-4">
    <UiCheckbox :checked="accepted" @change="$emit('toggle')" />
    <div class="ml-4" v-if="custom">
      <div>
        • Do not add <b>deflationary tokens</b> or tokens with transfer fees.
      </div>
      <div>• Do not add tokens with <b>no bool return values</b>.</div>
      <div>
        • Any other <b>non-compliance from ERC20</b> may cause issues. DYOR!
      </div>
      <div>
        • By checking this box I agree that Balancer Labs is not liable for any
        losses or issues I might have.
      </div>
    </div>
    <div class="ml-4" v-else>
      By checking this box I agree that Balancer Labs is not liable for any
      losses or issues I might have.
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
