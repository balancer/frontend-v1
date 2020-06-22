<template>
  <div>
    <VueLoadingIndicator v-if="!pool.id" class="big py-4" />
    <div
      v-else
      class="border rounded-1 panel-background"
      style="border-top-left-radius: 0 !important;"
    >
      <Filters class="overflow-hidden" :options="options" />
      <div>
        <ListTokens :pool="pool" />
      </div>
    </div>
  </div>
</template>

<script>
const options = [
  { name: 'Token', class: 'flex-auto text-left' },
  { name: 'Weight', class: 'column' },
  { name: 'Pool balance', class: 'column' },
  { name: 'My pool balance', class: 'column' },
  { name: 'My Asset Value', class: 'column' }
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
