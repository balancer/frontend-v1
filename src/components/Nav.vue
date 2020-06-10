<template>
  <nav id="nav">
    <Container class="d-flex">
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
          <span v-if="settings.name" v-text="settings.name" />
          <span v-else>{{ settings.address | shorten }}</span>
        </span>
        <a class="btn-outline" @click="modalAboutOpen = true">
          <span class="ml-n2 mr-n2" v-text="'?'" />
        </a>
      </div>
    </Container>
    <ModalAbout :open="modalAboutOpen" @close="modalAboutOpen = false" />
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      modalAboutOpen: false
    };
  },
  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions(['login'])
  }
};
</script>
