import { useMemo } from "react"
import { createNoise3D } from 'simplex-noise';
import * as THREE from 'three'

/**
 * 
 * @param size 噪音尺寸
 * @param scale 噪音频率
 * @returns 
 */
export function useNoise3DTexture(size: number = 32, scale: number = .1){



  const texture3D = useMemo(() => {
    const size = 32 // 纹理尺寸 32x32x32。尺寸越大越精细，但显存占用越高
    const data = new Float32Array(size * size * size * 4) // RGBA 4个通道
    const noise3D = createNoise3D() // 使用 simplex-noise 库

    let i = 0

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          // 为 RGB 三个通道生成不同的噪音，模拟你的 vec3(snoise, snoise, snoise)
          // 噪音范围通常是 -1 到 1，

          // R 通道 (Vel.x)
          const n1 = noise3D(x * scale, y * scale, z * scale)
          data[i] = n1

          // G 通道 (Vel.y) - 偏移一下坐标以获得不同的值
          const n2 = noise3D(x * scale + 100, y * scale, z * scale)
          data[i + 1] = n2

          // B 通道 (Vel.z)
          const n3 = noise3D(x * scale, y * scale + 100, z * scale)
          data[i + 2] = n3

          // A 通道
          data[i + 3] = 1

          i += 4
        }
      }
    }

    const texture = new THREE.Data3DTexture(data, size, size, size)
    texture.format = THREE.RGBAFormat
    // texture.type = THREE.UnsignedByteType
    // texture.minFilter = THREE.LinearFilter // 线性插值让低分辨率纹理看起来也很平滑
    // texture.magFilter = THREE.LinearFilter
    
    // 设置循环模式，这样 shader 里坐标超过 1.0 时会自动循环，实现无限空间
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.wrapR = THREE.RepeatWrapping
    
    texture.needsUpdate = true
    return texture
  }, [])

  return texture3D
}


