<template>
  <div>
    <Menu />
    <Container class="pt-4">
      <p>Total liquidity</p>
      <h3 class="mb-3">~${{ $n(settings.totalMarketcap.toFixed()) }}</h3>
      <p>Total volume 24h</p>
      <h3 class="mb-3">~${{ $n(settings.totalVolume1Day.toFixed()) }}</h3>
    </Container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['settings'])
  }
};
</script>
