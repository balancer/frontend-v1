<template>
  <UiTable>
    <UiTableHeader>
      <div v-text="'Time'" class="flex-auto text-left" />
      <div v-text="'Trade in'" class="column" />
      <div v-text="'Trade out'" class="column" />
      <div v-text="'Tx details'" class="column" />
    </UiTableHeader>
    <div class="border-top d-flex flex-items-center p-4 text-white">
      Nothing to see here.
    </div>
  </UiTable>
</template>

<script>
export default {
  props: ['pool']
};
</script>
