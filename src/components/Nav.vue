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
            class="mr-2 v-align-middle"
            width="28"
            height="28"
          />
          <div class="h2 d-inline-block v-align-middle">smartpool</div>
        </router-link>
      </div>
      <div class="py-4">
        <a
          v-if="!settings.address"
          class="btn-mktg mr-2"
          v-text="'Connect wallet'"
          @click="login"
        />
        <span v-else>
          <template v-if="config.chainId === settings.network.chainId">
            <span class="btn-outline ml-2">
              <span
                class="circle bg-blue mr-2 d-inline-block"
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
          <span v-else class="btn-red">
            <Icon
              name="warning"
              class="mr-1 v-align-middle"
              :title="settings.network.chainId"
            />
            Wrong network
          </span>
        </span>
      </div>
    </Container>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';
import config from '@/helpers/config';

export default {
  data() {
    return {
      config
    };
  },
  methods: {
    ...mapActions(['login'])
  }
};
</script>
