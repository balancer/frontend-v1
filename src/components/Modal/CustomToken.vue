<template>
  <UiModal :open="open" @close="$emit('close')">
    <div class="modal-body p-6 d-flex flex-items-center text-red">
      <Icon name="warning" class="mr-4" />
      <div>
        This is a higher-risk pool that contains one or more unlisted tokens. A
        liquidity pool is only as good as its weakest token! If a token were
        blacklisted, infinitely minted, frozen, or exploited in any other way,
        <b>the value of this pool could go to 0</b>. Balancer Labs is never
        liable for losses incurred through using our UI or the Balancer
        protocol. Be careful, and do your own research!
      </div>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: ['open']
};
</script>
