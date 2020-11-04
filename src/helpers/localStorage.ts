import { name } from '@/../package.json';
import { jsonParse } from '@/helpers/utils';

export function lsSet(key, value) {
  localStorage.setItem(`${name}.${key}`, JSON.stringify(value));
}

export function lsGet(key) {
  const item = localStorage.getItem(`${name}.${key}`);
  return jsonParse(item);
}

export function lsRemove(key) {
  localStorage.removeItem(`${name}.${key}`);
}
