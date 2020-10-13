<template>
  <div>
    <UiLoading v-if="!pool.id" class="big py-4" />
    <UiTable style="border-top-left-radius: 0 !important;" v-else>
      <UiTableTh>
        <div v-text="$t('token')" class="flex-auto text-left" />
        <div v-text="$t('weight')" class="column" />
        <div v-text="$t('poolBalance')" class="column hide-sm" />
        <div v-text="$t('myBalance')" class="column hide-sm hide-md" />
        <div
          v-text="$t('myAssetValue')"
          class="column hide-sm hide-md hide-lg"
        />
      </UiTableTh>
      <ListTokens :pool="pool" :bPool="bPool" />
    </UiTable>
  </div>
</template>

<script>
export default {
  props: ['pool', 'bPool']
};
</script>
