<template>
  <div>
    <VueLoadingIndicator v-if="!pool.id" class="big py-4" />
    <div
      v-else
      class="border-left-0 border-right-0 border-md border rounded-0 rounded-md-1 panel-background"
    >
      <Filters class="overflow-hidden" :options="options" />
      <ListTokens :pool="pool" />
    </div>
  </div>
</template>

<script>
const options = [
  { name: 'Token', class: 'flex-auto text-left' },
  { name: 'Weight', class: 'column' },
  { name: 'Pool balance', class: 'column hide-sm' },
  { name: 'My pool balance', class: 'column hide-sm hide-md' },
  { name: 'My asset value', class: 'column hide-sm hide-md hide-lg' }
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
