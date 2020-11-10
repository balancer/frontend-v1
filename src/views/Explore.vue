<template>
  <Page v-if="Object.keys(tokenList).length > 0">
    <div class="mb-5">
      <h1 class="mb-3">Explore pools</h1>
      <div class="mb-3">
        <router-link
          :to="{ name: 'explore' }"
          v-for="(list, i) in lists"
          :key="i"
          class="mr-2"
        >
          <Tag>{{ list.key }}</Tag>
        </router-link>
      </div>
    </div>
    <div v-for="(list, i) in lists" :key="i" class="mb-3">
      <Container>
        <router-link :to="{ name: 'explore' }" class="d-flex overflow-hidden">
          <h3 v-text="list.name" class="mb-3 flex-auto" />
          <i
            class="iconfont icongo text-white v-align-top mt-n1"
            style="font-size: 32px;"
          />
        </router-link>
      </Container>
      <Container :slim="true" v-if="loaded && !loading && list.pools">
        <div class="overflow-hidden mr-n3">
          <router-link
            v-for="(pool, i) in list.pools"
            :to="{ name: 'pool', params: { id: i } }"
            :key="i"
            class="d-block float-left col-12 col-lg-4"
          >
            <Block class="b-pool-block p-3 mr-3 mb-3">
              <div class="mb-3">Shared pool</div>
              <div class="mt-8 mb-4">
                <span class="Progress position-relative">
                  <span
                    v-for="(token, i) in pool.poolTokens"
                    :key="i"
                    :style="
                      `background-color: ${token.color}; width: ${token.weight}%;`
                    "
                    class="Progress-item text-center text-white"
                  >
                    <span
                      :style="`left: ${i * 35}px`"
                      class="position-absolute bottom-3 pr-2"
                    >
                      <Token
                        :size="30"
                        :address="token.address"
                        class="b-pool-block--logo border"
                      />
                    </span>
                    <span
                      class="position-absolute bottom-4 pb-1 right-0 b-pool-block--percent"
                    >
                      {{ token.symbol }}
                      {{ _num(token.weight / 100, 'percent') }}
                    </span>
                  </span>
                </span>
              </div>
              <div>
                <div>
                  Swap fee
                  <span class="float-right text-white">
                    {{ _num(pool.swapFee / 1e18, 'percent') }}
                  </span>
                </div>
                <div>
                  T.V.L.
                  <span class="float-right text-white">
                    {{ _num(pool.swapFee / 1e10, 'usd') }}
                  </span>
                </div>
                <div>
                  Volume (1d)
                  <span class="float-right text-white">
                    {{ _num((pool.swapFee * 2) / 1e12, 'usd') }}
                  </span>
                </div>
              </div>
            </Block>
          </router-link>
        </div>
      </Container>
    </div>
  </Page>
</template>

<script>
import { ipfsGet } from '@snapshot-labs/snapshot.js/src/utils';
import { getPools } from '@/_balancer/explore';
import provider from '@/helpers/provider';

export default {
  data() {
    return {
      loaded: false,
      loading: false,
      tokenList: {},
      pools: {}
    };
  },
  async created() {
    this.loading = true;
    this.tokenList = await ipfsGet(
      'cloudflare-ipfs.com',
      `balancer-team-bucket.storage.fleek.co/balancer/tokenlists/explore?cb=123`,
      'ipns'
    );
    this.pools = await getPools(
      this.config.chainId,
      provider,
      this.tokenList.tokens.map(token => token.address)
    );
    this.loading = false;
    this.loaded = true;
  },
  computed: {
    lists() {
      if (!this.tokenList) return {};
      return Object.fromEntries(
        Object.entries(this.tokenList.tags).map(tag => {
          tag[1].key = tag[0];
          tag[1].pools = Object.fromEntries(
            this.tokenList.tokens
              .filter(token => token.tags.includes(tag[0]))
              .map(token => [token.address, this.pools[token.address] || {}])
              .filter(token => token[1])
              .slice(0, 3)
          );
          return tag;
        })
      );
    }
  }
};
</script>

<style lang="scss">
@import '../vars';

.b-pool-block {
  background-color: $panel-background;
  overflow: hidden;

  .Progress {
    background-color: transparent !important;
    overflow: visible !important;

    .b-pool-block--percent {
      display: none;
    }

    &:hover {
      .Progress-item {
        opacity: 0.1;
      }

      .Progress-item:hover {
        opacity: 1;

        .b-pool-block--percent {
          display: block;
        }
      }
    }

    .Progress-item {
      &:first-child {
        border-radius: 7px 0 0 7px !important;
      }

      &:last-child {
        border-radius: 0 7px 7px 0 !important;
      }

      .b-pool-block--logo {
        background-color: $panel-background !important;
      }
    }
  }
}
</style>
