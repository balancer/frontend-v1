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
  { name: 'Time', class: 'flex-auto text-left' },
  { name: 'Trade in', class: 'column' },
  { name: 'Trade out', class: 'column' },
  { name: 'Tx details', class: 'column' }
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
