<template>
  <div
    class="overflow-hidden ml-n2 mr-n2 text-center border border-left-0 border-right-0 border-md-0 mb-4"
  >
    <div class="col-3 float-left">
      <div
        class="border-0 border-md rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2"><Price :amount="pool.liquidity" /></h2>
        <h4>Liquidity</h4>
      </div>
    </div>
    <div class="col-3 float-left">
      <div
        class="border-0 border-md rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2"><Price :amount="pool.totalVolume1Day" /></h2>
        <h4>Trade vol. (24hr)</h4>
      </div>
    </div>
    <div class="col-3 float-left">
      <div
        class="border-0 border-md rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2">{{ $n(pool.swapFee, 'percent') }}</h2>
        <h4>Pool swap fee</h4>
      </div>
    </div>
    <div class="col-3 float-left">
      <div
        class="border-0 border-md rounded-0 rounded-md-1 panel-background py-4 mx-0 mx-md-2"
      >
        <h2 class="mb-2">0%</h2>
        <h4>My pool share</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['pool']
};
</script>
