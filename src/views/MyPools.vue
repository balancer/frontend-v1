<template>
  <div>
    <Hero />
    <NavMain />
    <div>
      <Filters :options="options" v-model="filters" />
      <Container class="overflow-hidden">
        <div v-if="subgraph.myPools.length > 0">
          <ListPool
            v-for="(pool, i) in subgraph.myPools"
            :key="i"
            :pool="pool"
          />
        </div>
      </Container>
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
