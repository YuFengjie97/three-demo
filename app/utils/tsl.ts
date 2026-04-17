import { Fn, sin, vec3, tan, cos, PI, clamp, float, length, acos, mx_atan2, pow, cross, mat3, atan, vec2, asin, TWO_PI, sqrt, step, mix, mx_noise_vec3, vec4, triNoise3D, exp, oneMinus, abs, smoothstep } from "three/tsl";
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
  return a.add(b.mul(cos3(PI.mul(2).mul(t.mul(c).add(d)))))
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


export const lookAt2 = Fn(([dir]: [Node<'vec3'>]) => {
  const right = cross(dir, vec3(0., 1, 0)).normalize()
  const up = cross(right, dir).normalize()

  const rotationMatrix = mat3(right, up, dir);
  return rotationMatrix
})

export const lookAt = Fn(([dir]: [Node<'vec3'>]) => {
  // 1. 归一化目标向量
  const z = dir.normalize();

  // 2. 检查 dir 是否与原生的 Y 轴平行
  // 如果 abs(z.y) > 0.99，说明在极点，切换参考向量为 Z 轴 (0, 0, 1)
  const isPole = abs(z.y).greaterThan(0.99);
  const upReference = isPole ? vec3(0, 0, 1) : vec3(0, 1, 0);

  // 3. 计算右向量和上向量
  const x = cross(upReference, z).normalize();
  const y = cross(z, x).normalize();

  // 4. 构造旋转矩阵
  // 注意：在 WebGPU/TSL 中，mat3(col0, col1, col2) 是按列构造的
  return mat3(x, y, z);
});


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

/**
 * 基于 triNoise3D 的 3D Curl 流场
 * @param {Node<vec3>} pos - 粒子位置
 * @param {Node<float>} time - 时间演变
 * @param {Node<float>} speed - 噪声演变频率
 */
export const getCurlTriNoise = Fn(([ pos, time, speed ]: [Node<'vec3'>, Node<'float'>, Node<'float'>]) => {
  const eps = float(0.01); // 差分步长
  
  // 定义采样势场的内部函数，通过坐标偏移获得三个不相关的噪声分量
  const getPotential = (p) => {
    return vec3(
      triNoise3D(p, speed, time),
      triNoise3D(p.add(vec3(31.41, 58.22, 12.34)), speed, time), // 随机偏移避免对称
      triNoise3D(p.add(vec3(92.13, 15.76, 44.91)), speed, time)
    );
  };

  // 1. 在三个轴向上进行正负采样
  const p_dx = getPotential(pos.add(vec3(eps, 0, 0)));
  const m_dx = getPotential(pos.sub(vec3(eps, 0, 0)));
  
  const p_dy = getPotential(pos.add(vec3(0, eps, 0)));
  const m_dy = getPotential(pos.sub(vec3(0, eps, 0)));
  
  const p_dz = getPotential(pos.add(vec3(0, 0, eps)));
  const m_dz = getPotential(pos.sub(vec3(0, 0, eps)));

  // 2. 根据 Curl 公式计算分量
  // Curl.x = dAz/dy - dAy/dz
  const x = p_dy.z.sub(m_dy.z).sub(p_dz.y.sub(m_dz.y));
  
  // Curl.y = dAx/dz - dAz/dx
  const y = p_dz.x.sub(m_dz.x).sub(p_dx.z.sub(m_dx.z));
  
  // Curl.z = dAy/dx - dAx/dy
  const z = p_dx.y.sub(m_dx.y).sub(p_dy.x.sub(m_dy.x));

  // 3. 归一化输出，得到纯方向向量
  return vec3(x, y, z).normalize();
});

// 射线盒子相交检测。size为盒子大小
export const rayBoxDist = Fn(([ro, rd, size]: [Node<'vec3'>,Node<'vec3'>,Node<'vec3'>]) => {
  const m = vec3(1.0).div(rd);
  const n = m.mul(ro);
  const k = m.abs().mul(size);
  const t1 = n.negate().sub(k);
  const t2 = n.negate().add(k);
  const tN = t1.x.max(t1.y).max(t1.z); // 进入距离
  const tF = t2.x.min(t2.y).min(t2.z); // 离开距离
  // 返回 vec2(进入, 离开)
  return vec2(tN, tF);
});

export const exp3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(exp(v.x),exp(v.x),exp(v.x))
})

export const expToneMapping = Fn(([col]: [Node<'vec3'>]) => {
  return oneMinus( exp3(col.negate()) )
})

// v1 < v2
export const smoothRange = Fn(([v1, v2, v]: [Node<'float'>,Node<'float'>, Node<'float'>]) => {
  const eps = float(.1)
  return smoothstep(v1.sub(eps), v1.add(eps), v).mul(smoothstep(v2.add(eps), v2.sub(eps), v))
})
