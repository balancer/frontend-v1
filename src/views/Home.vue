<template>
  <div>
    <h3 class="mb-4">Shared pools</h3>
    <ListPools :query="{ where: { finalized: true } }" />
  </div>
</template>
