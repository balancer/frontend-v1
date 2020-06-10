<template>
  <div class="border-top">
    <Container class="pt-4 text-center">
      <h1 class="mb-6">Create a shared pool</h1>
      <div class="mx-auto text-left" style="max-width: 360px;">
        <label>Tokens</label>
        <div v-for="(token, i) in tokens" :key="i" class="my-3 d-flex">
          <Token :address="token.address" :size="44" class="mr-2" />
          <div>
            <div class="col-6 float-left">
              <input
                v-model="tokens[i].amount"
                type="number"
                step="any"
                class="h2 border-0 form-control width-fit"
                placeholder="0.0"
              />
            </div>
            <div class="col-6 float-left">
              <input
                v-model="tokens[i].weight"
                type="number"
                step="any"
                class="h2 border-0 form-control width-fit"
                placeholder="0.0"
                style="width: 100%;"
              />
            </div>
          </div>
        </div>
      </div>
      <button class="btn-mktg">Confirm</button>
    </Container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mainnet } from '@/constants.json';

export default {
  path: '/pool/new/shared',
  data() {
    return {
      tokens: [
        {
          address: mainnet.weth,
          amount: '',
          weight: '50'
        },
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          amount: '',
          weight: '50'
        }
      ]
    };
  },
  computed: {
    ...mapState(['settings'])
  }
};
</script>
