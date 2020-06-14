<template>
  <div>
    <Menu />
    <ListPools :query="{ where: { finalized: 'true' } }" />
  </div>
</template>

<script>
export default {
  path: '/'
};
</script>
