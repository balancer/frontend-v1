<template>
  <div class="border rounded-1 panel-background">
    <Filters class="overflow-hidden" :options="options" />
    <div
      v-for="(share, i) in pool.shares"
      :key="i"
      class="border-top d-flex flex-items-center p-4 text-white text-right"
    >
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
    </div>
  </div>
</template>

<script>
const options = [
  { name: 'Holder', class: 'flex-auto text-left' },
  { name: 'Balance', class: 'column' },
  { name: 'Shares', class: 'column' }
];

export default {
  props: ['pool'],
  data() {
    return {
      options
    };
  }
};
</script>
