// private name
const surplus = Symbol('surplus')
const width = Symbol('width')
const height = Symbol('height')
// 常量
const color = '#3B67BF'
const background = '#223459'

interface Particle {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
}

class ParticleLine {
  [width] = 300;
  [height] = 300;
  [surplus] = 0;

  ctx: CanvasRenderingContext2D
  particleNum = 100
  particleArr: Particle[] = []

  constructor(node: Node | null = null) {
    const body = document.querySelector('body') as HTMLBodyElement
    this[width] = window.innerWidth
    this[height] = window.innerHeight

    const canvas = document.createElement('canvas')
    canvas.innerText = '您的浏览器不支持 Canvas!'
    canvas.width = this[width]
    canvas.height = this[height]

    if (node === null) node = body.childNodes[0]
    body.insertBefore(canvas, node)
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.particleNum = this.getParticleNum(this[width], this[height])
    this.animation()
  }

  draw (): void {
    const ctx = this.ctx

    ctx.clearRect(0, 0, this[width], this[height])

    ctx.fillStyle = background
    ctx.fillRect(0, 0, this[width], this[height])

    for (let i = 0; i < this.particleNum; i++) {

      if (this.particleArr.length < i + 1) {
        const _r = 2.5

        const _p = {
          x: this.randomRange(_r, this[width] - _r),
          y: this.randomRange(_r, this[height] - _r),
          r: _r,
          color: color,
          vx: this.randomRange(-2, 2),
          vy: this.randomRange(-2, 2)
        }
        this.particleArr.push(_p)
        this[surplus]++
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
        if (_l < 80) {
          ctx.beginPath()
          ctx.moveTo(_p1.x, _p1.y)
          ctx.lineTo(_p2.x, _p2.y)
          ctx.lineWidth = 4 - _l / 20
          ctx.strokeStyle = color
          ctx.stroke()
        }
      }

      _p1.x += _p1.vx
      _p1.y += _p1.vy

      if ((_p1.x <= 0 || _p1.x >= this[width] || _p1.y <= 0 || _p1.y >= this[height]) && i1 < this[surplus]) {
        [this.particleArr[i1], this.particleArr[this[surplus] - 1]] = [this.particleArr[this[surplus] - 1], this.particleArr[i1]]
        this.particleArr[this[surplus] - 1].r = 4

        this[surplus]--
      }
    }

    this.particleArr.splice(this[surplus])
    // console.log(this[surplus] + ':' + this.particleArr.length)

    // requestAnimationFrame(this.draw().bind(this) as unknown as FrameRequestCallback)
  }

  animation (): void {

    // this.draw()


    setInterval(() => {
      this.draw()
    }, 100)
  }

  randomRange (min: number, max: number, ): number {
    return Math.floor(min + Math.random() * (max - min + 1))
  }

  getParticleNum (width: number, height: number): number {
    const num = Math.floor(width / 50) * Math.floor(height / 100)
    return num
  }

}

export default ParticleLine
