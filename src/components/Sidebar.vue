<template>
  <div
    id="sidebar"
    class="d-flex flex-column bottom-0 top-0 overflow-y-auto animate"
    :class="ui.sidebarIsOpen ? 'is-open' : 'is-closed'"
  >
    <nav class="nav">
      <ul class="list-style-none">
        <li v-if="$auth.isAuthenticated">
          <router-link
            :to="{ name: 'home' }"
            :class="{ active: $router.currentRoute.name === 'home' }"
            v-text="$t('dashboard')"
          />
        </li>
        <li>
          <router-link
            :to="{ name: 'explore' }"
            :class="{ active: $router.currentRoute.name === 'explore' }"
            v-text="$t('explorePools')"
          />
        </li>
        <template v-if="$auth.isAuthenticated">
          <li>
            <router-link
              :to="{ name: 'create' }"
              :class="{ active: $router.currentRoute.name === 'create' }"
              v-text="$t('createPool')"
            />
          </li>
          <li>
            <router-link
              :to="{ name: 'my-pools' }"
              :class="{ active: $router.currentRoute.name === 'my-pools' }"
              v-text="$t('myPools')"
            />
          </li>
        </template>
        <li>
          <a href="https://balancer.exchange" target="_blank">
            {{ $t('exchange') }}
            <Icon name="external-link" class="ml-1" />
          </a>
        </li>
        <li>
          <a @click="modalOpen = true" v-text="$t('about')" />
        </li>
      </ul>
    </nav>
    <ModalAbout :open="modalOpen" @close="modalOpen = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      modalOpen: false
    };
  }
};
</script>

<style lang="scss">
@import '../vars';

#sidebar {
  z-index: 5;
  border-right: $border;
  position: fixed;
  background-color: $panel-background;
  margin-top: 79px;
  padding-top: 20px;
  width: 264px;
  left: -264px;
  transition: left 0.2s;

  @media (min-width: $width-xl) {
    left: 0;
  }

  ul > li > a {
    font-size: 16px;
    color: $white;
    display: block;
    padding: 10px 22px 12px;

    &.active {
      background: $blue-900;
      border-left: 3px solid $blue;
      padding-left: 19px;
    }
  }

  &.is-open {
    left: 0 !important;
  }
}
</style>
