<template>
  <div>
    <Menu />
    <Filters v-model="filters" />
    <Container>
      <Pool v-for="pool in pools" :key="pool.id" :pool="pool" />
      <div v-if="settings.balances">
        <div
          v-for="(balance, tokenAddress) in balances"
          :key="tokenAddress"
          class="border-bottom py-3 d-flex"
        >
          <div class="flex-auto">
            <Token :address="tokenAddress" :size="44" />
          </div>
          <div class="text-gray text-center mt-3 hide-sm hide-md column">
            {{ balance | balance }}
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      filters: {}
    };
  },
  computed: {
    ...mapState(['settings']),
    pools() {
      if (!this.settings.sharesOwned.length) return [];
      return this.settings.sharesOwned.map(share => share.poolId);
    },
    balances() {
      const balancesArr = Object.entries(this.settings.balances).filter(
        balance => balance[1].toFixed(3) > 0
      );
      return Object.fromEntries(balancesArr);
    }
  },
  methods: {
    ...mapActions(['getSharesOwned'])
  },
  created() {
    if (!this.settings.sharesOwned.length) this.getSharesOwned();
  }
};
</script>
