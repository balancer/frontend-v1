<template>
  <div class="stats-block">
    <div class="stats-header d-flex flex-justify-between p-2">
      <div class="stats-title">{{ header }}</div>
      <div
        class="stats-expand d-flex flex-align-center flex-justify-center"
        :class="{ active: details }"
        @click="$emit('toggle-details')"
      >
        i
      </div>
    </div>
    <div class="assets p-2">
      <div class="d-flex">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="asset-icon"
        >
          <Token :address="token.address" :symbol="token.symbol" :size="24" />
        </div>
      </div>
      <div class="d-flex">
        <div
          v-for="token in pool.tokens"
          :key="token.address"
          class="asset-weight d-flex flex-items-center"
        >
          <span>{{ _num(getWeightShare(pool.tokens, token)) }}</span>
          <span class="asset-weight-percent">%</span>
        </div>
      </div>
    </div>
    <div class="stats p-2" v-if="details">
      <div class="stat">
        <div class="stat-key">Liquidity</div>
        <div class="stat-value">{{ _num(pool.liquidity, 'usd') }}</div>
      </div>
      <div class="stat">
        <div class="stat-key">Volume (24h)</div>
        <div class="stat-value">{{ _num(pool.volume, 'usd') }}</div>
      </div>
      <div class="stat">
        <div class="stat-key">Swap fee</div>
        <div class="stat-value">{{ _num(pool.swapFee, 'percent') }}</div>
      </div>
    </div>
    <div class="link">
      More
      <a :href="getPoolLink(pool.address)" target="_blank">
        <Icon name="external-link" size="14" />
      </a>
    </div>
  </div>
</template>

<script>
import { bnum, getPoolLink } from '@/helpers/utils';

export default {
  props: ['pool', 'details', 'isV1'],
  computed: {
    header() {
      return this.isV1 ? 'V1 Pool' : 'V2 Pool';
    }
  },
  methods: {
    getPoolLink(address) {
      return getPoolLink(address);
    },
    getWeightShare(tokens, token) {
      const totalWeight = tokens.reduce(
        (total, token) => total.plus(token.denormWeight),
        bnum(0)
      );
      const weight = bnum(token.denormWeight);
      return weight.div(totalWeight).times(100);
    }
  }
};
</script>

<style scoped>
.stats-block {
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  background: #1f2029;
  width: 160px;
}

.stats-header {
  border-bottom: 1px solid #2e2e2e;
  color: white;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}

.stats-expand {
  width: 24px;
  height: 24px;
  background: #21222c;
  border-radius: 50%;
  border: 1px solid #333;
  color: #90a4ae;
  cursor: pointer;
}

.stats-expand.active {
  background: #fff;
}

.assets {
  border-bottom: 1px solid #2e2e2e;
}

.asset-icon {
  width: 32px;
}

.asset-weight {
  color: white;
  width: 32px;
}

.asset-weight-percent {
  font-size: 10px;
}

.stats {
  border-bottom: 1px solid #2e2e2e;
}

.stat {
  min-width: 80px;
}

.stat-key {
  color: #90a4ae;
}

.stat-value {
  color: white;
  font-size: 18px;
}

.link {
  color: #90a4ae;
  padding: 8px;
}
</style>
