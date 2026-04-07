/**
 * 生成球面均匀分布坐标
 * @param {number} count - 点的数量
 * @param {number} radius - 球体半径 (默认为 1)
 * @returns {Float32Array} - [x, y, z, ...]
 */
export function getFibonacciSphere(count, radius = 1) {
  const result = new Float32Array(count * 3);
  // const goldenAngle = (Math.sqrt(5) + 1)/2
  const goldenAngle = 1.414214

  for (let i = 0; i < count; i++) {
    const prog = i / count
    const theta = 2 * Math.PI * i / goldenAngle
    const phi = Math.acos(1 - 2 * prog)
    const x = Math.sin(phi) * Math.cos(theta) * radius
    const y = Math.sin(phi) * Math.sin(theta) * radius
    const z = Math.cos(phi) * radius

    const i3 = i * 3
    result[i3 + 0] = x
    result[i3 + 1] = y
    result[i3 + 2] = z
  }

  return result;
}
