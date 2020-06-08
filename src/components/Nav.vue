<template>
  <nav id="nav">
    <div class="container-lg p-responsive d-flex">
      <div class="flex-auto">
        <h2>
          <router-link
            :to="{ name: 'home' }"
            class="my-4 d-inline-block text-blue"
          >
            smartpool
          </router-link>
        </h2>
      </div>
      <div class="py-4">
        <a
          v-if="!settings.address"
          class="btn-mktg mr-2"
          v-text="'Connect wallet'"
          @click="login"
        />
        <span v-else class="btn-outline mr-2">
          <span
            class="circle bg-blue mr-2 ml-n2 d-inline-block"
            style="width: 10px; height: 10px;"
          />
          {{ settings.name || shorten(settings.address) }}
        </span>
        <a class="btn-outline" @click="modalAboutOpen = true">
          <span class="ml-n2 mr-n2" v-text="'?'" />
        </a>
      </div>
    </div>
    <div class="bg-blue rounded-lg-2 mx-lg-4 py-8 mb-2">
      <div class="container-lg p-responsive">
        <h1 class="text-white">
          Your portfolio yielder
        </h1>
      </div>
    </div>
    <div class="container-lg p-responsive">
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
      </ul>
    </div>
    <ModalAbout :open="modalAboutOpen" @close="modalAboutOpen = false" />
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { shorten } from '@/helpers/utils';

export default {
  data() {
    return {
      modalAboutOpen: false
    };
  },
  computed: {
    ...mapState(['settings']),
    sharedPoolCount() {
      return this.settings.pools.filter(pool => pool.finalized).length;
    },
    privatePoolCount() {
      return this.settings.pools.filter(pool => !pool.finalized).length;
    }
  },
  methods: {
    ...mapActions(['login']),
    shorten
  }
};
</script>
