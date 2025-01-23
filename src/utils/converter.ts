import { TextureSubtypes } from "./sharedTypes";

/**
 * Converts an array of strings representing texture keys into a TextureSubtypes object.
 *
 * Example:
 * Input: ['_n', '_a', '_g', '_3m']
 * Output: {
 *   _a: true,
 *   _n: true,
 *   _r: false,
 *   _v: false,
 *   _d: false,
 *   _em: false,
 *   _3m: true,
 *   _Billboards_a: false,
 *   _Billboards_n: false,
 *   _g: true,
 *   _m: false,
 *   _1m: false,
 *   _van: false,
 *   _vat: false,
 * }
 */
export const convertToTextureSubtypes = (keys: string[]): TextureSubtypes => {
  // Start with all keys set to false
  const result: TextureSubtypes = {
    _a: false,
    _n: false,
    _r: false,
    _v: false,
    _d: false,
    _em: false,
    _3m: false,
    _Billboards_a: false,
    _Billboards_n: false,
    _g: false,
    _m: false,
    _1m: false,
    _van: false,
    _vat: false,
  };

  // Update only the keys present in `keys` to true
  keys.forEach((key) => {
    if (key in result) {
      result[key as keyof TextureSubtypes] = true;
    }
  });

  return result;
};
