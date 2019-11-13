const color = '#3B4250'
const background = '#FFFFFF'

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
}

class ParticleLine {
  width = 300
  height = 300
  ctx: CanvasRenderingContext2D
  particleNum = 50
  particleArr: Particle[] = []

  constructor(node: Node | null = null) {
    const body = document.querySelector('body') as HTMLBodyElement
    this.width = window.innerWidth
    this.height = window.innerHeight

    const canvas = document.createElement('canvas')
    canvas.innerText = '您的浏览器不支持 Canvas!'
    canvas.width = this.width
    canvas.height = this.height

    if (node === null) node = body.childNodes[0]
    body.insertBefore(canvas, node)
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.draw()
  }

  draw (): void {
    const ctx = this.ctx
    ctx.fillStyle = background
    ctx.fillRect(0, 0, this.width, this.height)

    this.particleNum = this.randomRange(90, 140)

    for (let i = 0; i < this.particleNum; i++) {
      if (this.particleArr.length < i + 1) {
        const _r = 2.5

        const _p = {
          x: this.randomRange(_r, this.width - _r),
          y: this.randomRange(_r, this.height - _r),
          r: _r,
          color: color,
          vx: this.randomRange(-2, 2),
          vy: this.randomRange(-2, 2)
        }
        this.particleArr.push(_p)
      }
      ctx.beginPath()
      ctx.arc(this.particleArr[i].x, this.particleArr[i].y, this.particleArr[i].r, 0, Math.PI * 2)
      ctx.fillStyle = this.particleArr[i].color
      ctx.fill()
    }

    // 上方画点过程中会新增点，无法遍历所有点进行线段的描绘
    for (let i1 = 0; i1 < this.particleNum; i1++) {
      const _p1 = this.particleArr[i1]
      for (let i2 = i1 + 1; i2 < this.particleNum; i2++) {
        const _p2 = this.particleArr[i2]
        const _l = Math.sqrt(Math.pow(_p1.x - _p2.x, 2) + Math.pow(_p1.y - _p2.y, 2))
        if (_l < 100) {
          ctx.beginPath()
          ctx.moveTo(_p1.x, _p1.y)
          ctx.lineTo(_p2.x, _p2.y)
          ctx.strokeStyle = color
          ctx.stroke()
        }
      }
    }
  }

  randomRange (min: number, max: number, ): number {
    return Math.floor(min + Math.random() * (max - min + 1))
  }

}

export default ParticleLine
