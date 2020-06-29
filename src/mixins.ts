import store from '@/store';
import { mapState } from 'vuex';
import { shorten, trunc } from '@/helpers/utils';

// @ts-ignore
const modules = Object.entries(store.state).map(module => module[0]);

export default {
  computed: {
    ...mapState(modules)
  },
  methods: {
    _shorten(str: string): string {
      return shorten(str);
    },
    _trunc(value: number, decimals: number): number {
      return trunc(value, decimals);
    }
  }
};
