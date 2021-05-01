<template>
  <div v-if="loading" class="stripe-loading">
    <div class="bg-gray rounded-1 anim-pulse assets-loading" />
  </div>
  <div v-else class="stripe">
    <div class="assets">
      <span class="asset-diff" v-if="assets.v1">{{ assets.v1 }} →</span>
      <span>{{ assets.v2 }}</span>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { bnum } from '@/helpers/utils';

export default {
  props: ['poolV1', 'poolV2', 'loading'],
  computed: {
    assets() {
      if (!this.poolV1.tokens || !this.poolV2.tokens) {
        return '';
      }

      const v1TotalWeight = this.poolV1.tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );
      const v2TotalWeight = this.poolV2.tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );

      const v1WeightString = this.getWeights(this.poolV1);
      const v1SymbolString = this.getSymbols(this.poolV1);
      const v2WeightString = this.getWeights(this.poolV2);
      const v2SymbolString = this.getSymbols(this.poolV2);

      const v1Tokens = this.poolV1.tokens;
      const v2Tokens = this.poolV2.tokens;

      let differentAssets = false;

      for (const v1Token of v1Tokens) {
        const v2Token = v2Tokens.find(
          v2Token => v1Token.address === v2Token.address.toLowerCase()
        );
        if (!v2Token) {
          differentAssets = true;
        }
      }
      if (differentAssets) {
        return {
          v1: `${v1WeightString} ${v1SymbolString}`,
          v2: `${v2WeightString} ${v2SymbolString}`
        };
      }

      for (let i = 0; i < v1Tokens.length; i++) {
        const weigth1 = v2TotalWeight.times(v1Tokens[i].denormWeight);
        const weigth2 = v1TotalWeight.times(v2Tokens[i].denormWeight);
        if (!weigth1.eq(weigth2)) {
          return {
            v1: v1WeightString,
            v2: `${v2WeightString} ${v2SymbolString}`
          };
        }
      }

      return {
        v2: `${v2WeightString} ${v2SymbolString}`
      };
    }
  },
  methods: {
    getWeights(pool) {
      const totalWeight = pool.tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );
      return pool.tokens
        .map(token =>
          bnum(token.denormWeight)
            .div(totalWeight)
            .times(100)
            .toFixed(0, BigNumber.ROUND_HALF_UP)
        )
        .join('/');
    },
    getSymbols(pool) {
      return pool.tokens
        .map(
          token =>
            this.poolV1.tokens.find(
              t => t.address === token.address.toLowerCase()
            ).symbol
        )
        .join('/');
    }
  }
};
</script>

<style scoped>
.stripe-loading {
  height: 42.8px;
  background: #1f2029;
  color: white;
  border: 1px solid #333333;
  border-radius: 8px;
  padding: 8px;
}

.assets-loading {
  height: 90%;
  width: 80%;
}

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

.asset-diff {
  color: #90a4ae;
  margin-right: 4px;
}
</style>
