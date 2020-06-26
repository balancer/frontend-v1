<template>
  <div>
    <VueLoadingIndicator v-if="!pool.id" class="big py-4" />
    <UiTable v-else>
      <UiTableHeader>
        <div v-text="'Token'" class="flex-auto text-left"/>
        <div v-text="'Weight'" class="column"/>
        <div v-text="'Pool balance'" class="column hide-sm"/>
        <div v-text="'My pool balance'" class="column hide-sm hide-md"/>
        <div v-text="'My asset value'" class="column hide-sm hide-md hide-lg"/>
      </UiTableHeader>
      <ListTokens :pool="pool" />
    </UiTable>
  </div>
</template>

<script>
export default {
  props: ['pool']
};
</script>
