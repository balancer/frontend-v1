import { ipfsGet } from '@snapshot-labs/snapshot.js/src/utils';
import config from '@/config';

const REGISTRY_IPNS_DOMAIN = 'balancer-team-bucket.storage.fleek.co';
const REGISTRY_IPNS_URLS = {
  '1': `${REGISTRY_IPNS_DOMAIN}/balancer-pool-management/registry`,
  '42': `${REGISTRY_IPNS_DOMAIN}/balancer-pool-management-kovan/registry`
};

export class Registry {
  public registry?;
  public metadata?;

  async init() {
    // const random = Math.random();
    this.registry = await ipfsGet(
      'cloudflare-ipfs.com',
      REGISTRY_IPNS_URLS[config.chainId],
      'ipns'
    );
    this.registry.pools = this.registry.pools.map((pool, i) => {
      pool.liquidity = this.registry.pools.length - i;
      return pool;
    });
    this.metadata = Object.fromEntries(
      this.registry.pools.map(pool => [pool.address, pool])
    );
  }

  getPools(query?) {
    let pools = this.registry.pools;
    if (query.tag && query.tag !== 'all')
      pools = pools.filter(pool => pool.tags && pool.tags.includes(query.tag));
    if (query.tokens) {
      query.tokens.forEach(token => {
        pools = pools.filter(pool => pool.tokens.includes(token.toLowerCase()));
      });
    }
    if (query.orderBy) {
      pools = pools.sort((a, b) => b[query.orderBy] - a[query.orderBy]);
    }
    if (query.limit) {
      const page = query.page || 0;
      pools = pools.slice((page - 1) * query.limit, page * query.limit);
    }
    return pools.map(pool => pool.address);
  }

  getPoolIds() {
    return this.registry.pools.map(pool => pool.address);
  }

  getTags() {
    return {
      defi: {
        name: 'DeFi'
      },
      stablecoin: {
        name: 'Stablecoins'
      },
      'smart-pool': {
        name: 'Smart pools'
      },
      private: {
        name: 'Private pools'
      }
    };
  }
}

export default new Registry();
