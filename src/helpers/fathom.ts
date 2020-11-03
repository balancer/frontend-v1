import config from '@/config';

export function setGoal(id, value = 0) {
  if (window['fathom'] && config.network === 'homestead')
    window['fathom'].trackGoal(id, value);
}
