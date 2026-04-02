export class TailCanvas {
  ctx: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  gradientRadius: number = 70
  constructor() {
    this.canvas = document.createElement('canvas')
    
    this.canvas.width = document.documentElement.clientWidth
    this.canvas.height = document.documentElement.clientHeight
    const styleW = 300
    const styleH = this.canvas.height / this.canvas.width * styleW
    this.canvas.style = `
      display: block;
      width: ${styleW}px;
      height: ${styleH}px;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10
    `
    this.gradientRadius = Math.min(this.canvas.width, this.canvas.height) * .3
    this.ctx = this.canvas.getContext('2d')!
  }

  draw(mousePos: { x: number, y: number }) {
    const { x: mx, y: my } = mousePos
    const { clientWidth, clientHeight } = document.documentElement
    const { ctx } = this
    const {width: w, height: h} = this.canvas
    const x = mx / clientWidth * w
    const y = my / clientHeight * h


    ctx.fillStyle = `rgba(0,0,0,.05)`
    ctx.fillRect(0, 0, w, h)

    const {gradientRadius} = this

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, gradientRadius);
    // 定义渐变色：中心纯白 -> 边缘透明
    gradient.addColorStop(0, 'rgba(255, 255, 255, .5)');   // 中心不透明
    // gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)'); // 中间半透明
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');   // 边缘完全透明
    ctx.fillStyle = gradient

    ctx.beginPath();
    ctx.arc(x, y, gradientRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}