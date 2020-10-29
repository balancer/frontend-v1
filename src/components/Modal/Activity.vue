<template>
  <UiModal :open="open" @close="$emit('close')" style="max-width: 440px;">
    <h3 v-text="$t('pendingTransactions')" class="m-4 mb-0 text-center" />
    <Block class="m-4">
      <div v-if="myPendingTransactions.length">
        <div
          v-for="(tx, i) in myPendingTransactions"
          :key="i"
          :style="i === 0 && 'border: 0 !important;'"
          class="border-top px-4 py-3 d-flex"
        >
          <div class="flex-auto">
            <a
              :href="_etherscanLink(tx.hash, 'tx')"
              target="_blank"
              class="text-white"
            >
              <h5
                v-text="tx.title || _shortenAddress(tx.hash)"
                class="d-inline-block mb-1"
              />
              <Icon name="external-link" size="16" class="ml-1 mr-2" />
            </a>
            <div v-text="$d(tx.addedAt * 1e3, 'long')" />
          </div>
          <div
            v-text="tx.confirmedAt ? 'Confirmed' : 'Pending'"
            :class="tx.confirmedAt && 'text-green'"
          />
        </div>
      </div>
      <h5 class="text-white text-center p-4" v-else>
        {{ $t('noPendingTransactions') }}
      </h5>
    </Block>
  </UiModal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['open'],
  computed: {
    ...mapGetters(['myPendingTransactions'])
  }
};
</script>
