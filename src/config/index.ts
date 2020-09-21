import merge from 'lodash/merge';
import registry from 'assets/generated/pm/registry.homestead.json';
import registryKovan from 'assets/generated/pm/registry.kovan.json';
import homestead from '@/config/homestead.json';
import kovan from '@/config/kovan.json';

registry.tokens['0xD46bA6D942050d489DBd938a2C909A5d5039A161'] = {
  address: '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  id: 'ampleforth',
  name: 'Ampleforth',
  symbol: 'AMPL',
  decimals: 9,
  precision: 2,
  color: '#8d6268',
  hasIcon: true
};

const configs = { homestead, kovan };
configs.homestead = merge(registry, configs.homestead);
configs.kovan = merge(registryKovan, configs.kovan);
const network = process.env.VUE_APP_NETWORK || 'homestead';

export default configs[network];
