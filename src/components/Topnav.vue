<template>
  <nav id="topnav" class="border-bottom position-fixed width-full">
    <div class="d-flex flex-items-center px-5" style="height: 78px;">
      <div class="flex-auto d-flex flex-items-center">
        <a class="d-block d-xl-none text-white" @click="toggleSidebar">
          <Icon name="menu" size="28" class="mr-3" />
        </a>
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
            style="letter-spacing: 1px; font-size: 16px;"
            v-text="'Balancer'"
          />
        </router-link>
      </div>
      <div :key="web3.account">
        <template v-if="$auth.isAuthenticated && !wrongNetwork">
          <UiButton @click="modalOpen = true" :loading="loading">
            <Avatar :address="web3.account" size="16" class="ml-n1 mr-n1" />
            <span
              v-if="web3.name"
              v-text="web3.name"
              class="hide-sm ml-2 pl-1"
            />
            <span
              v-else
              v-text="_shortenAddress(web3.account)"
              class="hide-sm ml-2 pl-1"
            />
          </UiButton>
        </template>
        <UiButton v-if="web3.injectedLoaded && wrongNetwork" class="button-red">
          <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
          {{ $t('wrongNetwork') }}
        </UiButton>
        <UiButton
          v-if="showLogin"
          @click="modalOpen = true"
          :loading="loading"
          class="button-primary"
        >
          {{ $t('connectWallet') }}
        </UiButton>
        <router-link v-if="!wrongNetwork" :to="{ name: 'wallet' }" class="ml-2">
          <UiButton class="v-align-bottom p-0">
            <Icon name="wallet" size="20" class="mx-3" />
          </UiButton>
        </router-link>
      </div>
    </div>
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
        (!this.$auth.isAuthenticated && !this.web3.injectedLoaded) ||
        (!this.$auth.isAuthenticated && !this.wrongNetwork)
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
}
</style>
