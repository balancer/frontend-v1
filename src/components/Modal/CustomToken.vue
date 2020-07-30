<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body p-6 d-flex flex-items-center text-red">
      <Icon name="warning" class="mr-4" />
      This is a risky pool as it contains a token outside of whitelist. A
      liquidity pool is only as good as its weakest token. If the token gets
      blacklisted, infinitely minted, or exploited in any other way, the pool
      value can go to 0. Slow down and do your own research!
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open']
};
</script>
