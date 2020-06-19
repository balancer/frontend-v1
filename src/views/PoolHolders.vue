<template>
  <Container>
    <div>
      <div
        v-for="(share, i) in pool.shares"
        :key="i"
        class="d-flex border-bottom text-right"
      >
        <a
          :href="`https://etherscan.io/address/${share.userAddress.id}`"
          target="_blank"
          class="d-flex flex-auto text-left text-gray"
        >
          <div class="py-3">
            <Avatar :address="share.userAddress.id" size="32" class="mr-2" />
          </div>
          <div class="py-4">
            {{ share.userAddress.id | shorten }}
            <Icon name="external-link" size="16" class="ml-1" />
          </div>
        </a>
        <div class="column py-4 text-gray">{{ $n(share.balance) }} BPT</div>
        <div class="column py-4 text-gray">
          {{ $n((100 / pool.totalShares) * share.balance) }}%
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
export default {
  props: ['pool']
};
</script>
