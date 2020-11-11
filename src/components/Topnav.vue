<template>
  <nav id="topnav" class="position-fixed width-full">
    <div class="px-5 d-flex">
      <div class="d-flex flex-auto" style="font-size: 16px;">
        <router-link
          :to="{ name: 'home' }"
          class="d-inline-block d-flex pt-3 mt-1"
          style="padding-top: 2px;"
        >
          <img
            src="~/@/assets/logo.svg"
            class="mr-2 v-align-middle"
            width="32"
            height="32"
          />
          <span class="d-inline-block text-white mr-6" v-text="'Balancer'" />
        </router-link>
        <div class="topnav-menu float-left">
          <router-link :to="{ name: 'home' }" class="d-inline-block py-4 px-2">
            Explore pools
          </router-link>
          <router-link
            v-if="$auth.isAuthenticated"
            :to="{ name: 'dashboard' }"
            class="d-inline-block py-4 px-2"
          >
            Dashboard
          </router-link>
          <span class="hide-sm">
            <a
              @click="modalOpen.about = true"
              class="d-inline-block py-4 px-2 hide-md"
            >
              About
            </a>
            <a
              href="https://balancer.exchange"
              target="_blank"
              class="d-inline-block py-4 px-2 hide-md"
            >
              Exchange
              <Icon name="external-link" class="ml-1" />
            </a>
          </span>
        </div>
      </div>
      <div class="pt-2 mt-1" :key="web3.account">
        <UiButton
          v-if="$auth.isAuthenticated && !wrongNetwork"
          @click="modalOpen.account = true"
          :loading="loading || ui.authLoading"
        >
          <Avatar :address="web3.account" size="16" class="ml-n1 mr-n1" />
          <span
            v-if="web3.name"
            v-text="web3.name"
            class="hide-sm hide-md ml-2 pl-1"
          />
          <span
            v-else
            v-text="_shortenAddress(web3.account)"
            class="hide-sm hide-md ml-2 pl-1"
          />
        </UiButton>
        <UiButton
          v-if="$auth.isAuthenticated && wrongNetwork"
          class="button-red"
        >
          <Icon name="warning" class="ml-n2 mr-1 v-align-middle" />
          {{ $t('wrongNetwork') }}
        </UiButton>
        <UiButton
          v-if="!$auth.isAuthenticated && !ui.authLoading"
          @click="modalOpen.account = true"
          :loading="loading"
          class="button-primary"
        >
          <Icon name="login" class="hide-lg hide-xl" />
          <span class="hide-sm hide-md" v-text="$t('connectWallet')" />
        </UiButton>
        <router-link v-if="!wrongNetwork" :to="{ name: 'wallet' }" class="ml-2">
          <UiButton class="v-align-bottom p-0">
            <Icon name="wallet" size="20" class="mx-3" />
          </UiButton>
        </router-link>
        <UiButton
          v-if="myPendingTransactions.length"
          @click="modalOpen.activity = true"
          class="button-primary ml-2"
        >
          {{ myPendingTransactions.length }}
        </UiButton>
      </div>
    </div>
    <portal to="modal">
      <ModalAccount
        :open="modalOpen.account"
        @close="modalOpen.account = false"
        @login="handleLogin"
      />
      <ModalActivity
        :open="modalOpen.activity"
        @close="modalOpen.activity = false"
        @login="handleLogin"
      />
      <ModalAbout :open="modalOpen.about" @close="modalOpen.about = false" />
    </portal>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      modalOpen: {
        account: false,
        activity: false,
        about: false
      }
    };
  },
  computed: {
    ...mapGetters(['myPendingTransactions']),
    wrongNetwork() {
      return (
        this.config.chainId !== this.web3.injectedChainId &&
        !this.ui.authLoading &&
        !this.loading
      );
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleLogin(connector) {
      this.modalOpen.account = false;
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
  box-shadow: inset 0 -1px $panel-border;
  background-color: $panel-background;
  color: $text-white;

  .topnav-menu {
    .router-link-exact-active {
      color: $text-white;
      box-shadow: inset 0 -4px $input-hover-border;
    }
  }
}
</style>
