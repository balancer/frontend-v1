<template>
  <div id="sidenav" class="hide-xl" v-if="ui.sidenavOpen">
    <ul>
      <li v-if="web3.account">
        <router-link :to="{ name: 'dashboard' }">
          Dashboard
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'home' }">
          Explore pools
        </router-link>
      </li>
      <li>
        <a href="https://balancer.exchange" target="_blank">
          Swap
          <Icon name="external-link" size="12" class="ml-1" />
        </a>
      </li>
      <li>
        <a href="https://claim.balancer.finance" target="_blank">
          Claim BAL
          <Icon name="external-link" size="12" class="ml-1" />
        </a>
      </li>
    </ul>
    <div @click="hideSidenav" class="shell" />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['toggleSidenav', 'hideSidenav'])
  }
};
</script>

<style scoped lang="scss">
@import '../vars';

#sidenav {
  text-align: center;
  font-size: 16px;
  width: 100%;

  .shell {
    z-index: 96;
    position: fixed;
    background-color: rgba(0, 0, 0, 0.4);
    top: 70px;
    bottom: 0;
    width: 100%;
  }

  ul {
    position: fixed;
    top: 70px;
    width: 100%;
    z-index: 97;

    li a {
      width: 100%;
      display: inline-block;
      line-height: 52px;
      padding-bottom: 4px;
      background-color: $panel-background;
      border-bottom: $border;

      &:hover,
      &.router-link-exact-active {
        color: $text-white;
      }
    }
  }
}
</style>
