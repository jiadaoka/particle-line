interface Point {
  x: number;
  y: number;
  v0x: number;
  v0y: number;
  vx: number;
  vy: number;
  r?: number;
  ax?: number;
  ay?: number;
  color?: string;
}

class Particle implements Point {
  x: number
  y: number
  v0x: number
  v0y: number
  vx: number
  vy: number
  r: number
  color: string
  ax = 0
  ay = 0

  constructor(x: number, y: number, vx: number, vy: number, r = 5, color = '#3463B3') {
    this.x = x
    this.y = y
    this.v0x = vx
    this.v0y = vy
    this.vx = vx
    this.vy = vy
    this.r = r
    this.color = color
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }

  connection (ctx: CanvasRenderingContext2D, endX: number, endY: number, lineWidth: number): void {
    ctx.beginPath()
    ctx.moveTo(this.x, this.y)
    ctx.lineTo(endX, endY)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = this.color
    ctx.stroke()
  }
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
  particleMouse: Particle | null = null
  index = 0
  time = 0

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

    this.mousemove(canvas)
    this.mouseover(canvas)
    this.mouseout(canvas)

    this.animation()
  }


  createParticle (): void {
    const len = this.particleArr.length
    if (len >= this.particleNum) return
    for (let i = len; i < this.particleNum; i++) {
      const _r = 5
      const _p: Particle = new Particle(this.randomRange(_r, this.width - _r), this.randomRange(_r, this.height - _r), this.randomRange(-1, 1, true, false), this.randomRange(-1, 1, true, false))
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

      _p1.x += _p1.vx
      _p1.y += _p1.vy

      _p1.draw(ctx)

      if ((_p1.x <= 0 || _p1.x >= this.width || _p1.y <= 0 || _p1.y >= this.height) && i1 < this.surplus) {
        [this.particleArr[i1], this.particleArr[this.surplus - 1]] = [this.particleArr[this.surplus - 1], this.particleArr[i1]]
        this.particleArr[this.surplus - 1].r = 4

        this.surplus--
      }

      for (let i2 = i1 + 1; i2 < this.surplus; i2++) {
        const _p2 = this.particleArr[i2]
        const _l = Math.sqrt(Math.pow(_p1.x - _p2.x, 2) + Math.pow(_p1.y - _p2.y, 2))
        if (_l < 80) {
          _p1.connection(ctx, _p2.x, _p2.y, 4 - _l / 20)
        }
      }

    }

    this.particleArr.splice(this.surplus)

    if (this.particleMouse) {
      this.particleMouse.draw(ctx)
      for (let i = 0; i < this.surplus; i++) {
        const _pm = this.particleMouse
        const _p2 = this.particleArr[i]
        const _l = Math.sqrt(Math.pow(_pm.x - _p2.x, 2) + Math.pow(_pm.y - _p2.y, 2))

        if (_l < 80) {
          _pm.connection(ctx, _p2.x, _p2.y, 4 - _l / 20)
        }

        if (_l < 120) {
          _p2.ax = ((_pm.x - _p2.x) / _l) * (0.05 * _p2.v0x)
          _p2.ay = ((_pm.y - _p2.y) / _l) * (0.05 * _p2.v0y)
        } else if (_l < 80) {
          _p2.ax = ((_pm.x - _p2.x) / _l) * (((80 - _l) / 160 + 0.5) * _p2.v0x * 0.1)
          _p2.ay = ((_pm.y - _p2.y) / _l) * (((80 - _l) / 160 + 0.5) * _p2.v0y * 0.1)
        } else if (_p2.ax !== 0 && _p2.ay !== 0) {
          _p2.ax = 0
          _p2.ay = 0
        }

        _p2.vx += _p2.ax
        _p2.vy += _p2.ay
      }
    }
  }

  animation (): void {
    this.draw()
    if (this.time === 0) this.time = new Date().getTime()
    const time = new Date().getTime() - this.time
    console.log(this.index++ + ':' + time)
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

  mouseover (el: HTMLElement): void {
    return el.addEventListener('mouseover', e => {
      this.particleMouse = new Particle(e.clientX, e.clientY, 0, 0)
    })
  }

  mousemove (el: HTMLElement): void {
    return el.addEventListener('mousemove', e => {
      if (this.particleMouse !== null) {
        this.particleMouse.x = e.clientX
        this.particleMouse.y = e.clientY
      }
    })
  }

  mouseout (el: HTMLElement): void {
    return el.addEventListener('mouseout', () => {
      this.particleMouse = null
    })
  }

}

export default ParticleLine
