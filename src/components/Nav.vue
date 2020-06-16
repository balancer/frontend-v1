<template>
  <nav id="nav">
    <Container class="d-flex">
      <div class="flex-auto">
        <router-link
          :to="{ name: 'home' }"
          class="my-4 d-inline-block text-blue d-flex"
        >
          <img
            src="~/@/assets/logo.svg"
            class="mr-2 v-align-middle anim-pulse-in"
            width="32"
            height="32"
          />
          <div class="h2 d-inline-block v-align-middle">smartpool</div>
        </router-link>
      </div>
      <div class="py-4">
        <template v-if="settings.address && !wrongNetwork">
          <span class="btn-outline ml-2">
            <span
              class="circle bg-blue ml-n1 mr-2 d-inline-block"
              style="width: 10px; height: 10px;"
            />
            <span v-if="settings.name" v-text="settings.name" />
            <span v-else>{{ settings.address | shorten }}</span>
          </span>
          <router-link
            :to="{ name: 'wallet' }"
            class="btn-outline ml-2 d-inline-block"
          >
            <Icon name="wallet" class="ml-n2 mr-n2 v-align-middle" />
          </router-link>
        </template>
        <span v-if="settings.hasProvider && wrongNetwork" class="btn-red">
          <Icon
            name="warning"
            class="ml-n2 mr-1 v-align-middle"
            :title="network.chainId"
          />
          Wrong network
        </span>
        <a
          v-if="
            (!settings.address && !settings.hasProvider) ||
              (!settings.address && !wrongNetwork)
          "
          class="btn-mktg mr-2"
          v-text="'Connect wallet'"
          @click="login"
        />
      </div>
    </Container>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';
import config from '@/helpers/config';

export default {
  computed: {
    wrongNetwork() {
      return config.chainId !== this.network.chainId;
    }
  },
  methods: {
    ...mapActions(['login'])
  }
};
</script>
