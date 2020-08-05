import numeral from 'numeral';
import { mapGetters, mapState } from 'vuex';
import store from '@/store';
import config from '@/config';
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
    _n(number, key) {
      let format = number > 1000 ? '(0.[00]a)' : '(0.[000]a)';
      if (key === 'raw') format = '0.[000000]';
      if (key === 'currency') format = '$(0.[00]a)';
      if (key === 'price') format = '$(0.[00]a)';
      if (key === 'percent') format = '(0.[00]a)%';
      if (number < 0.0001) number = 0;
      return numeral(number)
        .format(format)
        .toUpperCase();
    },
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
      const token = config.tokens[address];
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
