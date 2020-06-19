<template>
  <Container>
    <Nav :items="items" />
  </Container>
</template>

<script>
import { clone } from '@/helpers/utils';

const startItems = [
  {
    name: 'Tokens',
    to: { name: 'pool' }
  },
  {
    name: 'Swaps',
    to: { name: 'pool-swaps' }
  },
  {
    name: 'Holders',
    to: { name: 'pool-holders' }
  }
];

export default {
  props: ['pool'],
  computed: {
    items() {
      const items = clone(startItems);
      items[0].count = this.pool.tokens.length;
      items[1].count = this.pool.swapsCount;
      items[2].count = this.pool.holders;
      if (
        this.subgraph.myPools.map(myPool => myPool.id).includes(this.pool.id)
      ) {
        items.push({
          name: 'Settings',
          to: { name: 'pool-settings' }
        });
      }
      return items;
    }
  }
};
</script>
