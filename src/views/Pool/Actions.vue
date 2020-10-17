<template>
  <div class="border rounded-1 panel-background p-4 text-white">
    <div
      v-if="bPool.metadata.rights.canChangeWeights"
      class="border-bottom mb-4 pb-3"
    >
      <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
        <h4 v-text="$t('manageWeights')" class="flex-auto" />
      </div>
      <div>
        <UiButton
          v-text="$t('poke')"
          class="float-right"
          @click="handlePokeWeights()"
        />
      </div>
      <div v-if="isOwner">
        <div class="float-right mr-2">
          <UiButton
            v-text="$t('updateGradually')"
            @click="modalOpen.gradualWeights = true"
          />
        </div>
        <div class="float-right mr-2">
          <UiButton v-text="$t('update')" @click="modalOpen.weights = true" />
        </div>
      </div>
      <label v-text="$t('weights')" class="d-block mb-2" />
      <Pie :tokens="pool.tokens" size="64" class="mr-2" />
    </div>

    <div
      v-if="bPool.metadata.rights.canAddRemoveTokens && isOwner"
      class="border-bottom mb-4 pb-3"
    >
      <div class="d-flex flex-items-center px-4 px-md-0 mb-3">
        <h4 v-text="$t('addRemoveTokens')" class="flex-auto" />
      </div>
      <UiTable class="mb-4">
        <div v-for="token in pool.tokens" :key="token.address">
          <UiTableTr>
            <div class="d-flex flex-auto flex-items-center text-left">
              <Token :address="token" :symbol="token" class="mr-3" />
              {{ token.symbol }}
            </div>
            <div class="column-xs">
              <a
                class="d-flex flex-justify-end text-white"
                :disabled="ongoingUpdate"
                @click="handleRemoveToken(token)"
              >
                <Icon name="close" />
              </a>
            </div>
          </UiTableTr>
        </div>
      </UiTable>

      <!-- disabled for now -->
      <UiButton
        v-if="pool.tokens.length < 8"
        class="mb-4"
        :disabled="ongoingUpdate || true"
      >
        {{ $t('addToken') }}
      </UiButton>

      <div class="d-flex flex-items-center p-4 warning-box">
        <Icon name="warning" size="22" class="mr-4" />
        <div v-html="$t('removeTokenWarning')" />
      </div>
    </div>

    <!-- disabled for now -->
    <UiButton
      v-if="bPool.metadata.rights.canWhitelistLPs && isOwner"
      class="mb-4"
      :disabled="true"
      @click="modalOpen.manageWhitelist = true"
    >
      {{ $t('manageWhitelist') }}
    </UiButton>

    <MessageError
      v-if="this.transactionReverted"
      :text="$t('txReverted')"
      class="mt-4"
    />
    <ModalEditWeights
      :pool="pool"
      :open="modalOpen.weights"
      @close="modalOpen.weights = false"
    />
    <ModalEditWeightsGradually
      :pool="pool"
      :open="modalOpen.gradualWeights"
      @close="modalOpen.gradualWeights = false"
    />
    <ModalEditTokens
      :value="pool.tokensList"
      :open="modalOpen.tokens"
      @close="modalOpen.tokens = false"
    />
    <ModalManageWhitelist
      :pool="pool"
      :open="modalOpen.manageWhitelist"
      @close="modalOpen.manageWhitelist = false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { isTxReverted } from '@/helpers/utils';

export default {
  props: ['pool', 'bPool'],
  data() {
    return {
      modalOpen: {
        weights: false,
        gradualWeights: false,
        tokens: false,
        manageWhitelist: false
      },
      transactionReverted: false
    };
  },
  watch: {
    open() {
      this.transactionReverted = false;
    }
  },
  computed: {
    isOwner() {
      return (
        this.web3.dsProxyAddress.toLowerCase() ===
        this.pool.crpController.toLowerCase()
      );
    },
    ongoingUpdate() {
      return this.bPool.metadata.gradualUpdate.startBlock > 0;
    }
  },
  methods: {
    ...mapActions(['pokeWeights', 'removeToken']),
    async handlePokeWeights() {
      const txResult = await this.pokeWeights();
      if (isTxReverted(txResult)) {
        this.transactionReverted = true;
      }
    },
    async handleRemoveToken(tokenAddress) {
      const txResult = await this.removeToken(tokenAddress);
      if (isTxReverted(txResult)) {
        this.transactionReverted = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../vars';

.warning-box {
  border: 1px solid $warning;
  border-radius: 4px;
  color: $warning;
}
</style>
