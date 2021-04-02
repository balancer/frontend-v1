import { Contract } from '@ethersproject/contracts';
import { abi } from './MerkleRedeem.json';
import { getAddress } from '@ethersproject/address';

export async function call(provider, abi: any[], call: any[], options?) {
  const contract = new Contract(call[0], abi, provider);
  try {
    const params = call[2] || [];
    return await contract[call[1]](...params, options || {});
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function ipfsGet(
  gateway: string,
  ipfsHash: string,
  protocolType = 'ipfs'
) {
  const url = `https://${gateway}/${protocolType}/${ipfsHash}`;
  return fetch(url).then(res => res.json());
}

const gateway = process.env.VUE_APP_IPFS_NODE || 'cloudflare-ipfs.com';

export const constants = {
  1: {
    merkleRedeem: '0x6d19b2bF3A36A61530909Ae65445a906D98A2Fa8',
    snapshot:
      'https://storageapi.fleek.co/balancer-team-bucket/balancer-claim/snapshot'
  },
  42: {
    merkleRedeem: '0x3bc73D276EEE8cA9424Ecb922375A0357c1833B3',
    snapshot:
      'https://storageapi.fleek.co/balancer-team-bucket/balancer-claim-kovan/snapshot'
  }
};

export async function getSnapshot(network) {
  if (constants[network]?.snapshot)
    return (
      (await fetch(constants[network].snapshot).then(res => res.json())) || {}
    );
  return {};
}

export async function getClaimStatus(network, provider, ids, address) {
  return await call(provider, abi, [
    constants[network].merkleRedeem,
    'claimStatus',
    [address, 1, ids]
  ]);
}

export async function getReports(snapshot, weeks) {
  const reports = await Promise.all(
    weeks.map(week => ipfsGet(gateway, snapshot[week]))
  );
  return Object.fromEntries(reports.map((report, i) => [weeks[i], report]));
}

export async function getTotalPendingClaims(network, provider, address) {
  const snapshot = await getSnapshot(network);
  const claimStatus = await getClaimStatus(
    network,
    provider,
    Object.keys(snapshot).length,
    address
  );
  const pending = claimStatus
    .map((status, i) => [i + 1, status])
    .filter(([, status]) => status === false)
    .map(([i]) => i);
  const reports = await getReports(snapshot, pending);
  return Object.entries(reports)
    .map((report: any) => report[1][getAddress(address)])
    .map(claim => parseFloat(claim))
    .reduce((a, b) => a + b, 0);
}
