<template>
  <div>
    <Menu />
    <Pools :pools="pools" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['settings']),
    pools() {
      return this.settings.pools.filter(pool => !pool.finalized);
    }
  }
};
</script>
