<template>
  <nav id="menu" class="mb-3">
    <div class="bg-black mosaic rounded-lg-2 mx-lg-4 py-8">
      <Container>
        <h1 class="text-white text-center text-md-left flex-auto">
          Your portfolio yielder
        </h1>
      </Container>
    </div>
    <Container>
      <ul class="list-style-none">
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'home' }">
            <div class="mb-3">
              Shared pools
              <span
                v-if="explore.balancer.finalizedPoolCount"
                class="counter ml-2"
                v-text="$n(explore.balancer.finalizedPoolCount)"
              />
            </div>
            <span class="blob anim-grow-x" />
          </router-link>
        </li>
        <li class="d-inline-block mr-4">
          <router-link :to="{ name: 'private' }">
            <div class="mb-3">
              Private pools
              <span
                v-if="explore.balancer.privatePoolCount"
                class="counter ml-2"
                v-text="$n(explore.balancer.privatePoolCount)"
              />
            </div>
            <span class="blob anim-grow-x" />
          </router-link>
        </li>
        <li class="d-inline-block mr-4" v-if="provider.account">
          <router-link :to="{ name: 'my-pools' }">
            <div class="mb-3">My pools</div>
            <span class="blob anim-grow-x" />
          </router-link>
        </li>
      </ul>
    </Container>
  </nav>
</template>
