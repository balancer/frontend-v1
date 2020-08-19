import merge from 'lodash/merge';
import registry from 'assets/generated/pm/registry.homestead.json';
import registryKovan from 'assets/generated/pm/registry.kovan.json';
import homestead from '@/config/homestead.json';
import staging from '@/config/homestead.staging.json';
import kovan from '@/config/kovan.json';
import { clone } from '@/helpers/utils';

const configs = {
  production: { homestead, kovan },
  staging: { homestead: merge(clone(homestead), staging), kovan }
};
configs.production.homestead = merge(registry, configs.production.homestead);
configs.production.kovan = merge(registryKovan, configs.production.kovan);
configs.staging.homestead = merge(registry, configs.staging.homestead);
configs.staging.kovan = merge(registryKovan, configs.staging.kovan);
const env = process.env.VUE_APP_ENV || 'production';
const network = process.env.VUE_APP_NETWORK || 'homestead';

export default configs[env][network];
