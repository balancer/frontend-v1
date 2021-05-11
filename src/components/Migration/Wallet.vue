<template>
  <div class="stats-block">
    <div class="stats-header d-flex flex-justify-between p-2">
      <div class="stats-title">Wallet</div>
    </div>
    <div v-if="loading" class="p-2 assets-loading">
      <div class="bg-gray rounded-1 anim-pulse" />
    </div>
    <div v-else class="assets p-2">
      <div class="d-flex flex-column">
        <div
          v-for="asset in assets"
          :key="asset.address"
          class="asset d-flex flex-items-center mb-2"
        >
          <Token :address="asset.address" :symbol="asset.symbol" :size="24" />
          <div class="ml-2">{{ asset.amount }}</div>
        </div>
      </div>
    </div>
    <div class="p-2 wallet-label">
      Tokens not migrated to V2 will be returned to your wallet
    </div>
  </div>
</template>

<script>
export default {
  props: ['assets', 'loading']
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
  height: 41px;
}

.stats-title {
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
}

.assets-loading {
  height: 64.9px;
  border-bottom: 1px solid #2e2e2e;
}

.assets-loading > div {
  width: 50%;
  height: 100%;
}

.wallet-label {
  color: #a4b4bc;
  font-size: 13px;
}
</style>
