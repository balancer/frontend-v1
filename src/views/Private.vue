<template>
  <div>
    <Hero />
    <NavMain />
    <ListPools :query="{ where: { finalized: 'false' } }" />
  </div>
</template>
