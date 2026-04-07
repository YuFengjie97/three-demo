import { Fn, sin, vec3, tan, cos, PI, clamp, float, length, acos, mx_atan2, pow, cross, mat3, atan, vec2, asin, TWO_PI, sqrt, step, mix } from "three/tsl";
import type { Node } from "three/webgpu";

export const sin3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(sin(v.x), sin(v.y), sin(v.z))
})

export const s1 = Fn(([v]: [Node<'float'>]) => {
  return sin(v).mul(.5).add(.5)
})

export const cos3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(cos(v.x), cos(v.y), cos(v.z))
})

export const palette = Fn(([t, a, b, c, d]: [Node<'float'>, Node<'vec3'>, Node<'vec3'>, Node<'vec3'>, Node<'vec3'>]) => {
  return a.add(b.mul(cos3(PI.mul(2).mul(t).mul(c).add(d))))
})

export const powV3 = Fn(([v3, v]: [Node<'vec3'>, Node<'vec3'>]) => {
  return vec3(pow(v3.x, v.x), pow(v3.y, v.y), pow(v3.z, v.z))
})

/**
 * 将直角坐标 (Cartesian) 转换为球面坐标 (Spherical)
 * @param {Node} pos - 输入的 3D 坐标节点 (例如 positionLocal)
 * @returns {vec3} - (r, theta, phi)
 */
export const cartesianToSpherical = Fn(([pos]: [Node<'vec3'>]) => {
  const r = length(pos)

  const theta = acos(pos.z.div(r))

  const phi = mx_atan2(pos.y, pos.x)

  return vec3(r, theta, phi)
})

/**
 * 将球面坐标 (Spherical) 转换为直角坐标 (Cartesian)
 * @param {vec3} r - 半径 (距离) theta - 极角 (天顶角，与 Z 轴夹角，0 ~ PI) phi - 方位角 (XY 平面角度，-PI ~ PI)
 * @returns {vec3}  (x, y, z)
 */
export const sphericalToCartesian = Fn(([rtp]: [Node<'vec3'>]) => {
  const r = rtp.x.toVar()
  const theta = rtp.y.toVar()
  const phi = rtp.z.toVar()

  const sinTheta = sin(theta)

  // x = r * sin(theta) * cos(phi)
  const x = r.mul(sinTheta).mul(cos(phi))

  // y = r * sin(theta) * sin(phi)
  const y = r.mul(sinTheta).mul(sin(phi))

  // z = r * cos(theta)
  const z = r.mul(cos(theta))

  return vec3(x, y, z)
})


export const lookAt = Fn(([dir]: [Node<'vec3'>]) => {
  const right = cross(dir, vec3(0., 1, 0)).normalize()
  const up = cross(right, dir).normalize()

  const rotationMatrix = mat3(right, up, dir);
  return rotationMatrix
})


export const getSphereUV = Fn(([pos]: [any]) => {
  // 1. 极其关键：将坐标转为方向向量（长度强制为 1）
  const dir = pos.normalize();

  // 2. 计算 U (经度)
  // 如果发现贴图左右镜像或旋转了90度，可以尝试改为 atan(dir.x, dir.z) 或加负号
  const u = atan(dir.z, dir.x).div(TWO_PI).add(0.5);

  // 3. 极其关键：防止浮点误差导致 y 超出 [-1, 1] 范围
  const safeY = clamp(dir.y, -1.0, 1.0);

  // 4. 计算 V (纬度)
  const v = asin(safeY).div(PI).add(0.5);

  return vec2(u, v);
});

export const sdCircle = Fn(([p, radius]: [Node<'vec2'>, Node<'float'>]) => {
  return length(p).sub(radius)
})
export const sdBox = Fn(([p, size]: [Node<'vec2'>, Node<'vec2'>]) => {
  const q = p.abs().sub(size)
  return length(q.max(vec2(0))).add(q.x.max(q.y).min(0.0))
})
export const sdRoundedX = Fn(([p, w, r]: [Node<'vec2'>, Node<'float'>, Node<'float'>]) => {
    const pAbs = p.abs()

    const sumVal = pAbs.x.add(pAbs.y)
    const minVal = sumVal.min(w)

    const scaleVal = minVal.mul(0.5)

    const pShrinked = pAbs.sub(scaleVal)

    return length(pShrinked).sub(r)
})
export const sdEquilateralTriangle = Fn(([p, r]: [Node<'vec2'>, Node<'float'>]) => {
    // const float k = sqrt(3.0);
    const k = sqrt(3.0)

    // p.x = abs(p.x) - r;
    let px = p.x.abs().sub(r)
    
    // p.y = p.y + r/k;
    let py = p.y.add(r.div(k))

    // if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
    // TSL 中用 mix 和 step 替代 if
    const conditionVal = px.add(k.mul(py))
    const shouldFlip = step(0.0, conditionVal) // 如果 > 0 则为 1.0，否则为 0.0

    // 计算旋转后的坐标
    const newX = px.sub(k.mul(py))
    const newY = k.negate().mul(px).sub(py)
    const flippedP = vec2(newX, newY).div(2.0)

    // 混合原始坐标和旋转后的坐标
    // 如果 shouldFlip 是 1.0，取 flippedP；如果是 0.0，取原始值
    px = mix(px, flippedP.x, shouldFlip)
    py = mix(py, flippedP.y, shouldFlip)

    // p.x -= clamp( p.x, -2.0*r, 0.0 );
    // 注意：这里使用的是更新后的 px
    const clampVal = px.clamp(r.negate().mul(2.0), 0.0)
    px = px.sub(clampVal)

    const finalP = vec2(px, py)

    // return -length(p)*sign(p.y);
    // 注意：TSL 的 sign 返回的是 -1, 0, 1
    return length(finalP).negate().mul(finalP.y.sign())
})