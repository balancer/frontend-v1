<template>
  <div class="text-center mx-auto p-4" style="max-width: 260px;">
    <template v-if="!confirmed">
      <h2 class="text-white">Waiting...</h2>
      <VueLoadingIndicator class="loading-xl text-white py-6" />
      <h3 class="mb-3 text-white">Your transaction is being broadcasted</h3>
      <a
        :href="
          _etherscanLink(
            '0x85610520a1e5f609daa84081c7ae63fafbe358cb1122c94d3c1c018a3025aca9',
            'tx'
          )
        "
        target="_blank"
      >
        See on Etherscan
        <Icon name="external-link" size="16" class="ml-1" />
      </a>
    </template>
    <template v-else>
      <h2 class="text-white">Congrats!</h2>
      <div class="py-5">
        <Icon name="check" class="text-white" size="64" />
      </div>
      <h3 class="mb-3 text-white">
        Your transaction has been successfully broadcasted
      </h3>
      <div class="overflow-hidden mb-4">
        <a
          :href="
            _etherscanLink(
              '0x85610520a1e5f609daa84081c7ae63fafbe358cb1122c94d3c1c018a3025aca9',
              'tx'
            )
          "
          target="_blank"
        >
          See on Etherscan
          <Icon name="external-link" size="16" class="ml-1" />
        </a>
      </div>
      <UiButton
        type="button"
        class="button-outline d-inline-block column mx-1"
        @click="$emit('close')"
      >
        Close
      </UiButton>
    </template>
  </div>
</template>

<script>
import { delay } from '@/helpers/utils';

export default {
  props: ['tx'],
  data() {
    return {
      txId: '',
      confirmed: false
    };
  },
  async created() {
    await delay(5e3);
    this.confirmed = true;
  }
};
</script>
