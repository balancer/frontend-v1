import config from '@/config';

if (config.network === 'homestead') {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.usefathom.com/script.js');
  script.setAttribute('data-spa', 'auto');
  script.setAttribute('data-site', 'LANWVFKK');
  script.setAttribute('honor-dnt', 'true');
  script.setAttribute('defer', '');
  document.head.appendChild(script);
}

export function setGoal(id, value = 0) {
  if (window['fathom'] && config.network === 'homestead')
    window['fathom'].trackGoal(id, value);
}
