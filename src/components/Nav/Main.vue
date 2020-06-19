<template>
  <Container>
    <Nav :items="items" />
  </Container>
</template>

<script>
import { clone } from '@/helpers/utils';

const startItems = [
  {
    name: 'Shared pools',
    to: { name: 'home' }
  },
  {
    name: 'Private pools',
    to: { name: 'private' }
  }
];

export default {
  computed: {
    items() {
      const items = clone(startItems);
      items[0].count = this.subgraph.balancer.finalizedPoolCount;
      items[1].count = this.subgraph.balancer.privatePoolCount;
      if (this.web3.account) {
        items.push({
          name: 'My pools',
          to: { name: 'my-pools' },
          count: this.subgraph.myPools.length
        });
        items.push({
          name: 'Create a pool',
          to: { name: 'create' }
        });
      }
      return items;
    }
  }
};
</script>
