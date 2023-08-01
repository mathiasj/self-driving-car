/**
 * Linear interpolation
 *
 * @param {*} A point A
 * @param {*} B point B
 * @param {*} t percentage
 * @returns
 */
function lerp(A, B, t) {
  return A + (B - A) * t
}
