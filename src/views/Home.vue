<template>
  <div>
    <Hero />
    <NavMain />
    <ListPools :query="{ where: { finalized: true } }" />
  </div>
</template>
