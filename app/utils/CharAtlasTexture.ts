import { asset } from '~/utils/asset'


/**
 * chars 字符集合
 * gridSize 字符集合sqrt后的正方形大小
 */
export class CharAtlasCanvas {
  chars: string
  gridSize: number
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  canvasSize = 1024;
  constructor(chars: string) {
    this.chars = chars
    const length = chars.length
    this.gridSize = Math.ceil(Math.sqrt(length))
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;
    this.ctx = this.canvas.getContext('2d')!

    const fontUrl = asset('/font/ttf/subset-STXINWEI.TTF')
    const customFont = new FontFace('MyCustomFont', `url(${fontUrl})`);
    customFont.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
      this.draw()
    })
  }
  draw() {
    const { canvasSize, gridSize, ctx, chars } = this
    const cellSize = canvasSize / gridSize;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = "white"; // 字体颜色
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.font = `bold ${cellSize * 0.7}px  sans-serif`;
    ctx.font = `bold ${cellSize * 0.7}px 'MyCustomFont', sans-serif`;

    for (let i = 0; i < chars.length; i++) {
      const col = i % gridSize;
      const row = Math.floor(i / gridSize);
      // Canvas 原点在左上角
      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;
      ctx.fillText(chars[i], x, y);
    }
  }
  // getTexture(){
  //   const tex = new THREE.CanvasTexture(canvas);
  // // tex.colorSpace = THREE.SRGBColorSpace;
  //   // 重要：因为要拼接到面片上，不要边缘过滤导致颜色溢出
  //   tex.minFilter = THREE.LinearFilter; 
  //   return tex;
  // }
}
