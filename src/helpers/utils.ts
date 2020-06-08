export function shorten(str) {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}
