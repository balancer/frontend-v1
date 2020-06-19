<template>
  <nav id="nav">
    <Container class="d-flex">
      <div class="flex-auto">
        <router-link
          :to="{ name: 'home' }"
          class="my-4 d-inline-block text-blue d-flex"
          style="padding-top: 2px;"
        >
          <img
            src="~/@/assets/logo.svg"
            class="mr-2 v-align-middle anim-pulse-in"
            width="34"
            height="34"
          />
          <div class="h2 d-inline-block v-align-middle">smartpool</div>
        </router-link>
      </div>
      <div class="py-4">
        <template v-if="web3.account && !wrongNetwork">
          <router-link
            :to="{
              name: 'user',
              params: { id: web3.name || web3.account }
            }"
            class="btn-mktg ml-2"
          >
            <span
              class="circle bg-white ml-n1 mr-2 d-inline-block"
              style="width: 10px; height: 10px;"
            />
            <span v-if="web3.name" v-text="web3.name" />
            <span v-else>{{ web3.account | shorten }}</span>
          </router-link>
          <router-link
            :to="{ name: 'wallet' }"
            class="btn-mktg ml-2 d-inline-block"
          >
            <Icon name="wallet" class="ml-n2 mr-n2 v-align-middle" />
          </router-link>
        </template>
        <span v-if="web3.injectedLoaded && wrongNetwork" class="btn-red">
          <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
          Wrong network
        </span>
        <a
          v-if="
            (!web3.account && !web3.injectedLoaded) ||
              (!web3.account && !wrongNetwork)
          "
          class="btn-mktg"
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
      return config.chainId !== this.web3.injectedChainId;
    }
  },
  methods: {
    ...mapActions(['login'])
  }
};
</script>
