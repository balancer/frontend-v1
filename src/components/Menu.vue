<template>
  <nav id="menu" class="border-bottom">
    <div class="bg-blue-1 mosaic rounded-lg-2 mx-lg-4 py-8">
      <Container class="d-flex">
        <h1 class="text-blue flex-auto">
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
              v-if="explore.balancer.finalizedPoolCount"
              class="counter ml-2"
              v-text="$n(explore.balancer.finalizedPoolCount)"
            />
          </router-link>
        </li>
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'private' }">
            Private pools
            <span
              v-if="explore.balancer.privatePoolCount"
              class="counter ml-2"
              v-text="$n(explore.balancer.privatePoolCount)"
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
