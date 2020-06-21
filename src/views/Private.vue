<template>
  <div>
    <h3 class="mb-4">Private pools</h3>
    <ListPools :query="{ where: { finalized: false } }" />
  </div>
</template>
