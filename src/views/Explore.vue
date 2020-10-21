<template>
  <Page>
    <Container>
      <div class="flex-auto mb-3">
        <Toggle
          v-if="config.env !== 'production'"
          :value="type"
          :options="poolTypes"
          @select="selectType"
        />
      </div>
      <Filters :value="filters" v-model="filters" class="mb-3" />
    </Container>
    <ListPools :query="query" :key="JSON.stringify(query)" />
  </Page>
</template>

<script>
import { formatFilters } from '@/helpers/utils';
import pools from '@/_balancer/pools.json';

export default {
  data() {
    return {
      type: 'shared',
      filters: formatFilters(this.$route.query),
      poolTypes: {
        shared: 'Shared',
        smart: 'Smart',
        private: 'Private'
      }
    };
  },
  watch: {
    type() {
      let query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) query = {};
      query.type = this.type;
      this.$router.push({ query });
    },
    filters() {
      let query = formatFilters(this.filters);
      if (query.token && query.token.length === 0) query = {};
      query.type = this.type;
      this.$router.push({ query });
    }
  },
  computed: {
    query() {
      let query = this.querySharedPools;
      if (this.type === 'smart') query = this.querySmartPools;
      if (this.type === 'private') query = this.queryPrivatePools;
      const filters = formatFilters(this.filters);
      if (filters.token && filters.token.length > 0) {
        query.where.tokensList_contains = filters.token;
      }
      return query;
    },
    querySharedPools() {
      return {
        where: {
          finalized: true
        }
      };
    },
    querySmartPools() {
      if (this.config.chainId === 1)
        return {
          where: {
            id_in: Object.entries(pools)
              .filter(crp => crp[1].is_compatible)
              .map(crp => crp[0].toLowerCase())
          }
        };
      return {
        where: {
          crp: true
        }
      };
    },
    queryPrivatePools() {
      return {
        where: {
          finalized: false
        }
      };
    }
  },
  methods: {
    selectType(poolType) {
      this.type = poolType;
    }
  }
};
</script>
