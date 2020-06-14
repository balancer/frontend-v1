<template>
  <div>
    <Menu />
    <ListPools :query="{ where: { finalized: 'false' } }" />
  </div>
</template>
