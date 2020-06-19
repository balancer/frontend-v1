<template>
  <Container>
    <Nav :items="items" />
  </Container>
</template>

<script>
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
      const items = JSON.parse(JSON.stringify(startItems));
      items[0].count = this.subgraph.balancer.finalizedPoolCount;
      items[1].count = this.subgraph.balancer.privatePoolCount;
      if (this.web3.account)
        items.push({
          name: 'My pools',
          to: { name: 'my-pools' }
        });
      return items;
    }
  }
};
</script>
