interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color?: string;
}

class ParticleLine {
  width = 300
  height = 300
  background: string
  color: string
  surplus = 0
  ctx: CanvasRenderingContext2D
  particleNum = 100
  particleArr: Particle[] = []

  constructor(background = '#2D3553', color = '#3463B3', node: Node | null = null) {
    const body = document.querySelector('body') as HTMLBodyElement

    this.background = background
    this.color = color
    this.width = window.innerWidth
    this.height = window.innerHeight

    const canvas = document.createElement('canvas')
    canvas.innerText = '您的浏览器不支持 Canvas!'
    canvas.width = this.width
    canvas.height = this.height

    if (node === null) node = body.childNodes[0]
    body.insertBefore(canvas, node)
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.particleNum = this.getParticleNum(this.width, this.height)
    this.animation()
  }


  createParticle (): void {
    const len = this.particleArr.length
    if (len >= this.particleNum) return
    for (let i = len; i < this.particleNum; i++) {
      const _r = 5
      const _p: Particle = {
        x: this.randomRange(_r, this.width - _r),
        y: this.randomRange(_r, this.height - _r),
        r: _r,
        vx: this.randomRange(-1, 1, true, false),
        vy: this.randomRange(-1, 1, true, false)
      }
      this.particleArr.push(_p)
      this.surplus++
    }
  }

  draw (): void {
    const ctx = this.ctx
    this.createParticle()

    ctx.clearRect(0, 0, this.width, this.height)

    ctx.fillStyle = this.background
    ctx.fillRect(0, 0, this.width, this.height)

    for (let i1 = 0; i1 < this.particleNum; i1++) {
      const _p1 = this.particleArr[i1]

      ctx.beginPath()
      ctx.arc(_p1.x, _p1.y, _p1.r, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()

      if ((_p1.x <= 0 || _p1.x >= this.width || _p1.y <= 0 || _p1.y >= this.height) && i1 < this.surplus) {
        [this.particleArr[i1], this.particleArr[this.surplus - 1]] = [this.particleArr[this.surplus - 1], this.particleArr[i1]]
        this.particleArr[this.surplus - 1].r = 4

        this.surplus--
      }

      for (let i2 = i1 + 1; i2 < this.surplus; i2++) {
        const _p2 = this.particleArr[i2]
        const _l = Math.sqrt(Math.pow(_p1.x - _p2.x, 2) + Math.pow(_p1.y - _p2.y, 2))
        if (_l < 80) {
          ctx.beginPath()
          ctx.moveTo(_p1.x, _p1.y)
          ctx.lineTo(_p2.x, _p2.y)
          ctx.lineWidth = 4 - _l / 20
          ctx.strokeStyle = this.color
          ctx.stroke()
        }
      }

      _p1.x += _p1.vx
      _p1.y += _p1.vy

    }

    this.particleArr.splice(this.surplus)
  }

  animation (): void {
    this.draw()
    requestAnimationFrame(() => this.animation() as unknown as FrameRequestCallback)
  }

  randomRange (min: number, max: number, allowDecimal = true, allowZero = true): number {
    if (max <= min) throw '范围出错。'
    let num = min + Math.random() * (max - min)
    if (allowDecimal) {
      num = Math.floor(num * 100) / 100
    } else {
      num = Math.floor(num)
    }

    if (!allowZero && num === 0) num = this.randomRange(min, max, allowDecimal, allowZero)

    return num
  }

  getParticleNum (width: number, height: number): number {
    const num = Math.floor(width / 50) * Math.floor(height / 100)
    return num
  }

}

export default ParticleLine
