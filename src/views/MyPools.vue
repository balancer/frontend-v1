<template>
  <div>
    <h3 class="mb-4">My pools</h3>
    <ListPools :query="query" class="mb-4" />
  </div>
</template>

<script>
const query = {
  where: {
    id_in: [
      '0xbe6daaf4ab70a1690759331aec740881620856f0',
      '0xe3bdae21c5afc2dd0d58bdc2324e5ac3c8801f40',
      '0x456a6019e548700f3ebd7d2afa5e2cca44e7c3c8'
    ]
  }
};

export default {
  data() {
    return {
      query
    };
  }
};
</script>
