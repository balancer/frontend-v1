<template>
  <div>
    <h3 class="mb-4">Private pools</h3>
    <ListPools :query="query" class="mb-4" />
  </div>
</template>

<script>
const query = { where: { finalized: false } };

export default {
  data() {
    return {
      query
    };
  }
};
</script>
