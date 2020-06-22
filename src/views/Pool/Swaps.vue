<template>
  <div class="border rounded-1 panel-background">
    <Filters class="overflow-hidden" :options="options" />
    <div class="border-top d-flex flex-items-center p-4 text-white">
      Nothing to see here.
    </div>
  </div>
</template>

<script>
const options = [
  // { key: 'Time', name: 'Time' },
  { key: 'tradeIn', name: 'Trade in' },
  { key: 'tradeOut', name: 'Trade out' },
  { key: 'txDetails', name: 'Tx details' }
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
