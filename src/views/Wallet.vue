<template>
  <div>
    <Filters :options="options" v-model="filters" />
    <Container>
      <ListPlaceholderPool v-if="pools.length === 0" />
      <template v-else>
        <ListPool v-for="pool in pools" :key="pool.id" :pool="pool" />
        <div v-if="settings.balances">
          <ListBalance
            v-for="(balance, tokenAddress) in balances"
            :key="tokenAddress"
            :balance="balance"
            :tokenAddress="tokenAddress"
          />
        </div>
      </template>
    </Container>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const options = [
  { key: 'price', name: 'Price' },
  { key: 'value', name: 'Holding' }
];

export default {
  data() {
    return {
      options,
      loading: false,
      filters: {}
    };
  },
  computed: {
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
