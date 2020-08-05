<template>
  <div class="px-0 px-md-5 py-4">
    <ListPools title="Private pools" :query="query" class="mb-4" />
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
