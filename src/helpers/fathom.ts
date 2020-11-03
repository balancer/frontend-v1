import config from '@/config';

export function setGoal(id, value = 0) {
  if (window['fathom'] && config.network === 'homestead')
    window['fathom'].trackGoal(id, value);
}

export function pageView() {
  if (window['fathom'] && config.network === 'homestead') {
    const hash = window.location.hash.replace('#/', '');
    window['fathom'].trackPageview({ url: hash });
  }
}

if (config.network === 'homestead') {
  const script = document.createElement('script');
  script.setAttribute('src', 'https://cdn.usefathom.com/script.js');
  script.setAttribute('data-spa', 'auto');
  script.setAttribute('data-site', 'LANWVFKK');
  script.setAttribute('honor-dnt', 'true');
  script.setAttribute('auto', 'false');
  script.setAttribute('defer', '');
  document.head.appendChild(script);
  pageView();
}
