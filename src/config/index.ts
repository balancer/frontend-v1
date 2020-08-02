import merge from 'lodash/merge';
import homestead from '@/config/homestead.json';
import staging from '@/config/homestead.staging.json';
import kovan from '@/config/kovan.json';
import { clone } from '@/helpers/utils';

const configs = {
  production: { homestead, kovan },
  staging: { homestead: merge(clone(homestead), staging), kovan }
};
const env = process.env.VUE_APP_ENV || 'production';
const network = process.env.VUE_APP_NETWORK || 'homestead';

export default configs[env][network];
