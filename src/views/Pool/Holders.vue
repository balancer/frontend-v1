<template>
  <UiTable>
    <UiTableHeader>
      <div v-text="'Holder'" class="flex-auto text-left"/>
      <div v-text="'Balance'" class="column"/>
      <div v-text="'Shares'" class="column"/>
    </UiTableHeader>
    <UiTableLine v-for="(share, i) in pool.shares" :key="i">
      <div class="text-left flex-auto">
        <a
          :href="`https://etherscan.io/address/${share.userAddress.id}`"
          target="_blank"
          class="d-flex d-block text-white"
        >
          <Avatar :address="share.userAddress.id" size="16" class="mr-3" />
          <div>
            {{ share.userAddress.id | shorten }}
            <Icon name="external-link" size="16" class="ml-1" />
          </div>
        </a>
      </div>
      <div class="column">{{ $n(share.balance) }} BPT</div>
      <div class="column">
        {{ $n((100 / pool.totalShares) * share.balance) }}%
      </div>
    </UiTableLine>
  </UiTable>
</template>

<script>
export default {
  props: ['pool']
};
</script>
