import { JsonRpcProvider, AlchemyProvider } from '@ethersproject/providers';
import config from '@/config';

const provider = new JsonRpcProvider(config.rpcUrl);

export default provider;

export function getLoggingProvider(network: string) {
  const alchemyKey = 'KjFKFD1iyGgsEesE0xOovzJKkVd_Jn19';
  return new AlchemyProvider(network, alchemyKey);
}
