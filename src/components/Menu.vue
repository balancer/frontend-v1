<template>
  <nav id="menu" class="border-bottom">
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
            <span
              v-if="explore.balancer.poolCount"
              class="counter ml-2"
              v-text="explore.balancer.poolCount"
            />
          </router-link>
        </li>
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'private' }">
            Private pools
            <span
              v-if="explore.balancer.poolCount"
              class="counter ml-2"
              v-text="
                explore.balancer.poolCount - explore.balancer.finalizedPoolCount
              "
            />
          </router-link>
        </li>
        <li class="d-inline-block mr-4" v-if="settings.address">
          <router-link :to="{ name: 'my-pools' }">
            My pools
          </router-link>
        </li>
      </ul>
    </Container>
  </nav>
</template>

<script>
export default {
  computed: {
    privatePoolCount() {
      return this.settings.pools.filter(pool => !pool.finalized).length;
    }
  }
};
</script>
