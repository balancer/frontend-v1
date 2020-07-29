import store from '@/store';
import { mapGetters, mapState } from 'vuex';
import config from '@/helpers/config';
import { shorten, trunc, etherscanLink } from '@/helpers/utils';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);

export default {
  data() {
    return {
      config
    };
  },
  computed: {
    ...mapState(modules),
    ...mapGetters(['hasProxy'])
  },
  methods: {
    _shorten(str: string): string {
      return shorten(str);
    },
    _trunc(value: number, decimals: number): number {
      return trunc(value, decimals);
    },
    _etherscanLink(str: string, type: string): string {
      return etherscanLink(str, type);
    },
    _ticker(address: string): string {
      if (address === 'ether') return 'ETH';
      // @ts-ignore
      const token = this.web3.tokenMetadata[address];
      return token ? token.symbol : this._shorten(address);
    },
    _precision(rawValue: number, address: string): number {
      const tokenConfig = config.tokens[address] || {};
      const precision = tokenConfig.precision || config.defaultPrecision;
      const value = rawValue.toFixed(precision);
      return parseFloat(value);
    }
  }
};
