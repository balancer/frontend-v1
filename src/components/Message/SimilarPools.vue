<template>
  <div v-if="pools.length > 0" id="info" class="d-flex flex-items-center p-4">
    <Icon name="warning" size="22" class="mr-4" />
    <div>
      <div>
        There are similar pools available:
      </div>
      <div v-for="pool in pools" :key="pool.id">
        <router-link
          :to="{ name: 'pool', params: { id: pool.id } }"
          class="link"
          target="_blank"
        >
          • {{ formatPool(pool) }}
          <Icon name="external-link" size="12" class="ml-1" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const WEIGHT_FACTOR = 0.0025;
const FEE_FACTOR = 40;
const LIQUIDITY_THRESHOLD = 100000;
const LIQUIDITY_FACTOR = 0.1;
const SCORE_THRESHOLD = 0.1;

function getPoolScore(pool, modelPool) {
  const {
    tokens: modelTokens,
    swapFee: modelSwapFee,
    liquidity: modelLiquidity
  } = modelPool;
  const { tokens, swapFee, liquidity } = pool;
  if (liquidity <= modelLiquidity) {
    return 0;
  }
  const modelWeights = {};
  for (const token of modelTokens) {
    modelWeights[token.checksum] = token.weightPercent;
  }
  const weightDiff = tokens.reduce((acc, val) => {
    const weight = val.weightPercent;
    const modelWeight = modelWeights[val.address];
    return acc + Math.abs(weight - modelWeight);
  }, 0);
  const feeDiff = Math.abs(swapFee - modelSwapFee);

  const weightPenalty = weightDiff * WEIGHT_FACTOR;
  const feePenalty = feeDiff * feeDiff * FEE_FACTOR;
  const liquidityBonus =
    liquidity > LIQUIDITY_THRESHOLD
      ? Math.log(liquidity / LIQUIDITY_THRESHOLD) * LIQUIDITY_FACTOR
      : 0;
  return 1 - weightPenalty - feePenalty + liquidityBonus;
}

function processPools(pools) {
  const processedPools = pools.map(pool => {
    const id = pool.id;
    const totalWeight = pool.tokens.reduce((acc, val) => {
      const weight = parseFloat(val.denormWeight);
      return acc + weight;
    }, 0);
    const swapFee = parseFloat(pool.swapFee);
    const liquidity = parseFloat(pool.liquidity);
    const tokens = pool.tokens.map(token => {
      const denormWeight = parseFloat(token.denormWeight);
      return {
        address: token.checksum,
        weightPercent: (100 * denormWeight) / totalWeight
      };
    });
    return {
      id,
      tokens,
      swapFee,
      liquidity
    };
  });
  return processedPools;
}

export default {
  props: ['pool'],
  data() {
    return {
      pools: []
    };
  },
  watch: {
    async pool() {
      this.updatePools();
    }
  },
  created() {
    this.updatePools();
  },
  methods: {
    ...mapActions(['getPools']),
    async updatePools() {
      const tokens = this.pool.tokens.map(token => token.checksum);
      const query = {
        where: {
          finalized: true,
          tokensList_contains: tokens,
          tokensCount: tokens.length,
          liquidity_gt: 0
        }
      };
      const pools = await this.getPools(query);
      const processedPools = processPools(pools);
      // Rank and filter pools
      this.pools = processedPools
        .sort((a, b) => {
          const aPoolScore = getPoolScore(a, this.pool);
          const bPoolScore = getPoolScore(b, this.pool);
          return bPoolScore - aPoolScore;
        })
        .filter(pool => {
          const poolScore = getPoolScore(pool, this.pool);
          return poolScore > SCORE_THRESHOLD;
        })
        .slice(0, 3);
    },
    formatPool(pool) {
      // const tokens = Object.keys(pool.weights);
      const tokenShares = [];
      for (const token of pool.tokens) {
        const ticker = this._ticker(token.address);
        const weight = token.weightPercent;
        const tokenShare = `${this._n(weight / 100, 'percent')} ${ticker}`;
        tokenShares.push(tokenShare);
      }
      const tokenString = tokenShares.join(' ');
      const feeString = `fee: ${this._n(pool.swapFee, 'percent')}`;
      const liquidityString = `liquidity: ${this._n(
        pool.liquidity,
        'currency'
      )}`;

      return `${tokenString}, ${feeString}, ${liquidityString}`;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../vars';

#info {
  border: 1px solid #7685d5;
  border-radius: 4px;
  color: #7685d5;
}

.link {
  color: #7685d5;
  cursor: pointer;
}
</style>
