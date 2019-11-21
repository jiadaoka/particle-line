class Vec2D {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  plus (p: Vec2D): Vec2D {
    return new Vec2D(this.x + p.x, this.y + p.y)
  }

  minus (p: Vec2D): Vec2D {
    return new Vec2D(this.x - p.x, this.y - p.y)
  }

  times (p: number): Vec2D {
    return new Vec2D(this.x * p, this.y * p)
  }

  abs (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

class Particle {
  pos: Vec2D
  v: Vec2D
  r = 5
  color = '#3463B3'

  constructor(p: { pos: Vec2D; v: Vec2D; r?: number; color?: string }) {
    this.pos = p.pos
    this.v = p.v
    if (p.r) this.r = p.r
    if (p.color) this.color = p.color
  }

  update (a: Vec2D = new Vec2D(0, 0)): void {
    this.v = this.v.plus(a)
    this.pos = this.pos.plus(this.v)
  }

  calcAcceleration (center: Vec2D): Vec2D {
    return this.calcForce(center).plus(this.calcDrag()).times(1 / this.r)
  }

  calcForce (p: Vec2D): Vec2D {
    const _p: Vec2D = this.pos.minus(p)
    if (_p.abs() >= 20 && _p.abs() < 80) {
      _p.times(-0.01)
    } else {
      _p.x = 0
      _p.y = 0
    }
    return _p
  }

  calcDrag (): Vec2D {
    const vabs = this.v.abs()
    const v: Vec2D = new Vec2D(this.v.x, this.v.y)
    if (vabs > 2) {
      v.times(-0.01)
    } else {
      v.x = 0
      v.y = 0
    }
    return v
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }

  connection (ctx: CanvasRenderingContext2D, p: Vec2D, lineWidth: number): void {
    ctx.beginPath()
    ctx.moveTo(this.pos.x, this.pos.y)
    ctx.lineTo(p.x, p.y)
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

    // this.particleNum = this.getParticleNum(this.width, this.height)
    this.particleNum = 1

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
      const _p: Particle = new Particle({ pos: new Vec2D(this.randomRange(_r, this.width - _r), this.randomRange(_r, this.height - _r)), v: new Vec2D(this.randomRange(-1, 1, true, false), this.randomRange(-1, 1, true, false)), r: _r, color: `rgb(${this.randomRange(0, 255, false)},${this.randomRange(0, 255, false)},${this.randomRange(0, 255, false)})` })
      this.particleArr.push(_p)
      this.surplus++
    }
  }

  draw (): void {
    const ctx = this.ctx
    this.createParticle()

    // ctx.clearRect(0, 0, this.width, this.height)

    // ctx.fillStyle = this.background
    // ctx.fillRect(0, 0, this.width, this.height)

    for (let i = 0; i < this.surplus; i++) {
      const currP = this.particleArr[i]
      currP.draw(ctx)
      currP.update()

      if (currP.pos.x <= -5 || currP.pos.x >= this.width + 5 || currP.pos.y <= -5 || currP.pos.y >= this.height + 5) {
        [this.particleArr[i], this.particleArr[this.surplus - 1]] = [this.particleArr[this.surplus - 1], this.particleArr[i]]
        this.surplus--
        continue
      }

      for (let i2 = i + 1; i2 < this.surplus; i2++) {
        const p2 = this.particleArr[i2].pos
        const l = currP.pos.minus(p2).abs()

        if (l < 80) {
          currP.connection(ctx, p2, 2 * ((80 - l) / 80))
        }
      }
    }

    if (this.particleMouse !== null) {
      // this.particleMouse.draw(ctx)
      const pMouse = this.particleMouse
      for (let i = 0; i < this.particleNum; i++) {
        const p = this.particleArr[i]
        const a = p.calcAcceleration(pMouse.pos)
        console.log(a)
        p.update(a)
      }
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

  mouseover (el: HTMLElement): void {
    return el.addEventListener('mouseover', e => {
      this.particleMouse = new Particle({ pos: new Vec2D(e.clientX, e.clientY), v: new Vec2D(0, 0) })
    })
  }

  mousemove (el: HTMLElement): void {
    return el.addEventListener('mousemove', e => {
      if (this.particleMouse !== null) {
        this.particleMouse.pos.x = e.clientX
        this.particleMouse.pos.y = e.clientY
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
