export function pickRandom<T>(items: readonly T[]): T | undefined {
  if (items.length === 0) return undefined;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

export function pickRandomExcluding<T>(items: readonly T[], exclude: T | undefined): T | undefined {
  if (items.length === 0) return undefined;
  if (items.length === 1) return items[0];

  let candidate: T | undefined;
  do {
    candidate = pickRandom(items);
  } while (candidate === exclude);
  return candidate;
}
