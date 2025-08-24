/**
 * Mulberry32 PRNG - Fast, deterministic random number generator
 */
export function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * Box-Muller transform for normal distribution
 */
export function randn(prng: () => number): number {
  let u = 0, v = 0;
  while(u === 0) u = prng(); // Converting [0,1) to (0,1)
  while(v === 0) v = prng();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}