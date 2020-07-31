<template>
  <Container slim="1">
    <ListPools
      title="Explore pools"
      :query="querySharedPools"
      :key="JSON.stringify(querySharedPools)"
      class="mb-4"
    />
  </Container>
</template>

<script>
export default {
  computed: {
    querySharedPools() {
      return {
        where: {
          finalized: true
        }
      };
    }
  }
};
</script>
