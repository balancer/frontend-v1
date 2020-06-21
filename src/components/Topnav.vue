<template>
  <nav id="topnav" class="border-bottom position-fixed width-full">
    <div class="d-flex flex-items-center px-5" style="height: 78px;">
      <div class="flex-auto">
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block text-blue d-flex"
          style="padding-top: 2px;"
        >
          <img
            src="~/@/assets/logo.svg"
            class="mr-2 v-align-middle"
            width="32"
            height="32"
          />
          <span
            class="d-inline-block text-white"
            style="font-weight: 500; letter-spacing: 1px; font-size: 15px;"
            >Balancer</span
          >
        </router-link>
      </div>
      <div>
        <template v-if="web3.account && !wrongNetwork">
          <Button
            type="outline"
            :to="{
              name: 'user',
              params: { id: web3.name || web3.account }
            }"
          >
            <Avatar :address="web3.account" size="16" class="mr-2 ml-n1" />
            <span v-if="web3.name" v-text="web3.name" />
            <span v-else>{{ web3.account | shorten }}</span>
          </Button>
        </template>
        <Button v-if="web3.injectedLoaded && wrongNetwork" class="btn-red">
          <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
          Wrong network
        </Button>
        <Button
          v-if="
            (!web3.account && !web3.injectedLoaded) ||
              (!web3.account && !wrongNetwork)
          "
          @click="handleLogin"
          :disabled="loading"
        >
          <VueLoadingIndicator v-if="loading" />
          <template v-else>Connect wallet</template>
        </Button>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';
import config from '@/helpers/config';

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    wrongNetwork() {
      return config.chainId !== this.web3.injectedChainId;
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin() {
      this.loading = true;
      await this.login();
      this.loading = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

#topnav {
  z-index: 10;
  background-color: $panel-background;
}
</style>
