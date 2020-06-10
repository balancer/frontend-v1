<template>
  <nav id="menu">
    <div class="bg-blue rounded-lg-2 mx-lg-4 py-8 mb-2">
      <Container>
        <h1 class="text-white">
          Your portfolio yielder
        </h1>
      </Container>
    </div>
    <Container>
      <ul class="list-style-none">
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'home' }">
            Shared pools
            <span class="counter ml-2" v-text="sharedPoolCount" />
          </router-link>
        </li>
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'private' }">
            Private pools
            <span class="counter ml-2" v-text="privatePoolCount" />
          </router-link>
        </li>
        <li class="d-inline-block mr-4" v-if="settings.address">
          <router-link :to="{ name: 'my-liquidity' }">
            My liquidity
          </router-link>
        </li>
        <li class="d-inline-block mr-4" v-if="settings.address">
          <router-link :to="{ name: 'create' }">
            Create pool
          </router-link>
        </li>
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'stats' }">
            Statistics
          </router-link>
        </li>
      </ul>
    </Container>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['settings']),
    sharedPoolCount() {
      return this.settings.pools.filter(pool => pool.finalized).length;
    },
    privatePoolCount() {
      return this.settings.pools.filter(pool => !pool.finalized).length;
    }
  }
};
</script>
