import { ipfsGet } from '@snapshot-labs/snapshot.js/src/utils';

export class Registry {
  public registry?;
  public volumes?;

  async init() {
    // const random = Math.random();
    this.registry = await ipfsGet(
      'cloudflare-ipfs.com',
      `balancer-team-bucket.storage.fleek.co/balancer-pool-management/registry?cb=98`,
      'ipns'
    );
    this.registry.pools = this.registry.pools.map((pool, i) => {
      pool.liquidity = this.registry.pools.length - i;
      return pool;
    });
    this.volumes = Object.fromEntries(
      this.registry.pools.map(pool => [pool.address, pool.volume])
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

  getTags() {
    return ['defi', 'stablecoin', 'smart-pool', 'private'];
  }
}

export default new Registry();
