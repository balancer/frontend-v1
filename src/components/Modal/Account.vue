<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <div v-if="!web3.account || step === 'connect'">
      <h3 class="p-4 border-bottom text-center">Connect wallet</h3>
      <div class="m-4 mb-5">
        <a
          v-for="(connector, id, i) in config.connectors"
          :key="i"
          @click="$emit('login', connector.id)"
          target="_blank"
          class="mb-2 d-block"
        >
          <UiButton class="width-full v-align-middle">
            <img
              :src="
                `https://raw.githubusercontent.com/bonustrack/lock/master/connectors/assets/${connector.id}.png`
              "
              height="28"
              width="28"
              class="mr-2 v-align-middle"
            />
            {{ connector.name }}
          </UiButton>
        </a>
      </div>
    </div>
    <div v-else>
      <h3 class="p-4 border-bottom text-center">Account</h3>
      <div v-if="web3.account" class="m-4">
        <a
          :href="_etherscanLink(web3.account)"
          target="_blank"
          class="mb-2 d-block"
        >
          <UiButton class="width-full">
            <Avatar :address="web3.account" size="16" class="mr-2 ml-n1" />
            <span v-if="web3.name" v-text="web3.name" />
            <span v-else v-text="_shortenAddress(web3.account)" />
            <Icon name="external-link" class="ml-1" />
          </UiButton>
        </a>
        <UiButton @click="step = 'connect'" class="width-full mb-2">
          Connect wallet
        </UiButton>
        <UiButton @click="handleLogout" class="width-full text-red mb-2">
          Log out
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: ['open'],
  data() {
    return {
      step: null
    };
  },
  watch: {
    open() {
      this.step = null;
    }
  },
  methods: {
    ...mapActions(['logout']),
    async handleLogout() {
      await this.logout();
      this.$emit('close');
    }
  }
};
</script>
