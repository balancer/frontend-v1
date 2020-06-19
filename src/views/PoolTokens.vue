<template>
  <div>
    <VueLoadingIndicator v-if="!pool.id" class="big py-4" />
    <div v-else class="overflow-hidden clearfix">
      <Filters class="overflow-hidden" :options="options" />
      <Container>
        <ListTokens :pool="pool" />
      </Container>
    </div>
  </div>
</template>

<script>
const options = [
  { key: 'weight', name: 'Weight' },
  { key: 'poolBalance', name: 'Pool balance' },
  { key: 'myPoolValue', name: 'My pool balance' }
];

export default {
  props: ['pool'],
  data() {
    return {
      options,
      id: this.$route.params.id,
      loading: false
    };
  }
};
</script>
