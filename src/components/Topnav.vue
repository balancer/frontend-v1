<template>
  <nav id="topnav" class="border-bottom position-fixed top-0 width-full">
    <Container>
      <div class="d-flex flex-items-center" style="height: 78px;">
        <div class="flex-auto d-flex flex-items-center mt-1">
          <router-link
            :to="{ name: 'home' }"
            class="d-inline-block text-blue d-flex mr-5"
          >
            <img
              src="~/@/assets/logo.svg"
              class="mr-2 v-align-middle"
              width="32"
              height="32"
            />
            <span
              v-text="'Balancer'"
              class="d-inline-block text-white"
              style="font-size: 20px;"
            />
          </router-link>
          <router-link
            v-if="web3.account"
            :to="{ name: 'home' }"
            class="d-inline-block d-flex mr-3"
            style="font-size: 19px;"
          >
            My liquidity
          </router-link>
          <router-link
            :to="{ name: 'explore' }"
            class="d-inline-block d-flex mr-3"
            style="font-size: 19px;"
          >
            Explore
          </router-link>
          <router-link
            v-if="web3.account"
            :to="{ name: 'new-pool' }"
            class="d-inline-block d-flex mr-3"
            style="font-size: 19px;"
          >
            Create pool
          </router-link>
        </div>
        <div :key="web3.account">
          <template v-if="web3.account && !wrongNetwork">
            <UiButton @click="modalOpen = true" :loading="loading">
              <Avatar :address="web3.account" size="16" class="mr-2 ml-n1" />
              <span v-if="web3.name" v-text="web3.name" />
              <span v-else v-text="_shorten(web3.account)" />
            </UiButton>
            <router-link :to="{ name: 'wallet' }">
              <UiButton class="ml-2">
                <Icon size="20" name="wallet" class="ml-n1 mr-n1" />
              </UiButton>
            </router-link>
          </template>
          <UiButton
            v-if="web3.injectedLoaded && wrongNetwork"
            class="button-red"
          >
            <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
            Wrong Network
          </UiButton>
          <UiButton
            v-if="showLogin"
            @click="modalOpen = true"
            :loading="loading"
            class="button-primary"
          >
            Connect Wallet
          </UiButton>
        </div>
      </div>
    </Container>
    <ModalAccount
      :open="modalOpen"
      @close="modalOpen = false"
      @login="handleLogin"
    />
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      modalOpen: false
    };
  },
  computed: {
    wrongNetwork() {
      return this.config.chainId !== this.web3.injectedChainId;
    },
    showLogin() {
      return (
        (!this.web3.account && !this.web3.injectedLoaded) ||
        (!this.web3.account && !this.wrongNetwork)
      );
    }
  },
  methods: {
    ...mapActions(['toggleSidebar']),
    ...mapActions(['login']),
    async handleLogin(connector) {
      this.modalOpen = false;
      this.loading = true;
      await this.login(connector);
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

  a.router-link-exact-active {
    color: white;
  }
}
</style>
