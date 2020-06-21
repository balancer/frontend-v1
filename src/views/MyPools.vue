<template>
  <div>
    <h3 class="mb-4">My pools</h3>
    <div class="border rounded-1 panel-background">
      <Filters :options="options" v-model="filters" />
      <div class="overflow-hidden">
        <div v-if="subgraph.myPools.length > 0">
          <ListPool
            v-for="(pool, i) in subgraph.myPools"
            :key="i"
            :pool="pool"
          />
        </div>
        <ListLoadingPool v-if="loading" />
      </div>
    </div>
  </div>
</template>

<script>
const options = [
  { key: 'swapFee', name: 'Swap fee' },
  { key: 'marketcap', name: 'Marketcap', hideMobile: true },
  { key: 'volume1Day', name: 'Vol. 24h', hideMobile: true }
];

export default {
  props: ['query'],
  data() {
    return {
      options,
      loading: false,
      page: 0,
      filters: {}
    };
  }
};
</script>
