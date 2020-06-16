<template>
  <div class="border-top">
    <Filters :options="options" v-model="filters" />
    <Container>
      <div v-if="settings.balances">
        <ListBalance
          v-for="(balance, tokenAddress) in balances"
          :key="tokenAddress"
          :balance="balance"
          :tokenAddress="tokenAddress"
        />
      </div>
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
      filters: {},
      sharesOwned: []
    };
  },
  computed: {
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
  async created() {
    const sharesOwned = await this.getSharesOwned();
    console.log('Shares owned', sharesOwned);
  }
};
</script>
