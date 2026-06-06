/**
 * Rounds a number **up** to the nearest multiple of a given value.
 *
 * @param num - The number to round up.
 * @param nearest - The multiple to round to (must be greater than 0).
 * @returns The smallest multiple of `nearest` that is greater than or equal to `num`.
 *
 * @example
 * ```ts
 * ceilToNearest(12, 5); // 15
 * ceilToNearest(17, 10); // 20
 * ceilToNearest(99, 1); // 99
 * ```
 */
export const ceilToNearest = (num: number, nearest: number): number =>
  Math.ceil(num / nearest) * nearest

/**
 * Rounds a number **down** to the nearest multiple of a given value.
 *
 * @param num - The number to round down.
 * @param nearest - The multiple to round to (must be greater than 0).
 * @returns The largest multiple of `nearest` that is less than or equal to `num`.
 *
 * @example
 * ```ts
 * floorToNearest(12, 5); // 10
 * floorToNearest(17, 10); // 10
 * floorToNearest(99, 1); // 99
 * ```
 */
export const floorToNearest = (num: number, nearest: number): number =>
  Math.floor(num / nearest) * nearest
