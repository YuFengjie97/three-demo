import * as THREE from 'three'

export function createTextureArray(textures: THREE.Texture[]) {
  const { width, height } = textures[0]
  const depth = textures.length
  
  // 计算总大小 (RGBA = 4 channels)
  const size = width * height * 4
  const data = new Uint8Array(size * depth)

  textures.forEach((tex, i) => {
    // 将图片绘制到 Canvas 上以获取像素数据 (简化版，生产环境可用 createImageBitmap)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(tex.image, 0, 0)
    const imageData = ctx.getImageData(0, 0, width, height).data
    data.set(imageData, i * size)
  })

  const textureArray = new THREE.DataArrayTexture(data, width, height, depth)
  textureArray.format = THREE.RGBAFormat
  textureArray.type = THREE.UnsignedByteType
  textureArray.needsUpdate = true
  // WebGL2 必须设置
  textureArray.wrapS = THREE.RepeatWrapping
  textureArray.wrapT = THREE.RepeatWrapping
  
  return textureArray
}