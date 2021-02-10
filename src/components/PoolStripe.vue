<template>
  <div class="stripe">
    <div class="assets d-flex">{{ assets }}</div>
    <div class="liquidity">My liquidity: {{ _num(liquidity, 'usd') }}</div>
  </div>
</template>

<script>
import { bnum } from '@/helpers/utils';
export default {
  props: ['pool', 'liquidity'],
  computed: {
    assets() {
      if (!this.pool || !this.pool.tokens) {
        return '';
      }
      const totalWeight = this.pool.tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );
      const weightString = this.pool.tokens
        .map(token =>
          bnum(token.denormWeight)
            .div(totalWeight)
            .times(100)
            .toFixed(2)
        )
        .join('/');
      const symbolString = this.pool.tokens
        .map(token => token.symbol)
        .join('/');
      return `${weightString} ${symbolString}`;
    }
  }
};
</script>

<style scoped>
.stripe {
  background: #1f2029;
  color: white;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 8px;
}

.assets {
  font-weight: bold;
  font-size: 18px;
}
</style>
